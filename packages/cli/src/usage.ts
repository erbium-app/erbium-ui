import { execFileSync } from "node:child_process";
import { mkdtemp, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import * as Schema from "effect/Schema";
import { getTsconfig } from "get-tsconfig";
import { importSpecifiers, resolveLocalImport } from "./imports.ts";
import { loadLock, readText, safePath } from "./project.ts";
import { openRegistry } from "./registry.ts";
import { hash, parseJson } from "./revision.ts";

const trackedFiles = (root: string) =>
  execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: root,
    encoding: "utf-8",
    maxBuffer: 16 * 1024 * 1024,
  })
    .split("\0")
    .filter(Boolean);

const importGraph = async (root: string, files: readonly string[]) => {
  const cache = new Map<string, unknown>();
  const sources = files.filter((file) => /\.[cm]?[jt]sx?$/u.test(file));

  const references = await Promise.all(
    sources.map(async (file) => {
      const absolute = await safePath(root, file);
      const text = (await readText(absolute)) ?? "";
      const tsconfig = getTsconfig(path.dirname(absolute), { cache });

      const resolutions = await Promise.all(
        importSpecifiers(text).map(
          async (specifier) => await resolveLocalImport({ tsconfig }, absolute, specifier, true),
        ),
      );

      return { file: absolute, targets: resolutions.flatMap(({ target }) => target ?? []) };
    }),
  );

  const graph = new Map<string, Set<string>>();

  for (const { file, targets } of references) {
    for (const target of targets) {
      const importers = graph.get(target) ?? new Set<string>();
      importers.add(file);
      graph.set(target, importers);
    }
  }

  return graph;
};

const consumingFiles = (graph: ReadonlyMap<string, Set<string>>, targets: readonly string[]) => {
  const direct = new Set(targets.flatMap((file) => [...(graph.get(file) ?? [])]));
  const all = new Set(direct);

  // Sets visit entries appended during iteration. This walks each importer once.
  for (const file of all) {
    for (const importer of graph.get(file) ?? []) {
      all.add(importer);
    }
  }

  return { direct, all };
};

const scan = async (
  cwd: string,
  registry: Awaited<ReturnType<typeof openRegistry>> | undefined,
) => {
  const root = await realpath(cwd);
  const files = [...new Set(trackedFiles(root))].toSorted();
  const locks = files.filter((file) => /(?:^|\/)\.erbium\/lock\.json$/u.test(file));
  const graph = await importGraph(root, files);

  const packages = files
    .values()
    .filter((file) => path.basename(file) === "package.json")
    .map((file) => path.dirname(file))
    .toArray()
    .toSorted((left, right) => right.length - left.length);

  return await Promise.all(
    locks.map(async (lock) => {
      const directory = path.dirname(path.dirname(lock));
      const project = path.resolve(root, directory);
      const { items } = await loadLock(project);

      const usageItems = await Promise.all(
        Object.entries(items).map(async ([id, item]) => {
          const states = await Promise.all(
            Object.entries(item.files).map(async ([target, digest]) => {
              const absolute = await safePath(project, target);
              const local = await readText(absolute);

              return { absolute, target, modified: local === undefined || hash(local) !== digest };
            }),
          );

          const upstream = registry?.items[id] ?? null;

          const { direct, all } = consumingFiles(
            graph,
            states.map(({ absolute }) => absolute),
          );

          const importedBy = [...direct].map((file) => path.relative(root, file)).toSorted();

          const usedByProjects = [
            ...new Set(
              [...all].map((file) => {
                const relative = path.relative(root, file);

                return (
                  packages.find((entry) => entry === "." || relative.startsWith(`${entry}/`)) ?? "."
                );
              }),
            ),
          ].toSorted();

          return {
            id,
            revision: item.revision,
            upstream,
            updateAvailable: upstream !== null && upstream !== item.revision,
            modifiedFiles: states.flatMap(({ target, modified }) => (modified ? [target] : [])),
            importedBy,
            usedByProjects,
          };
        }),
      );

      return { project: directory, items: usageItems };
    }),
  );
};

const scanRemote = async (root: string, registry: Parameters<typeof scan>[1], repo: string) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "erbium-usage-"));
  const checkout = path.join(temporary, "checkout");

  try {
    execFileSync("git", ["-C", root, "clone", "--depth", "1", "--quiet", "--", repo, checkout], {
      cwd: root,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });

    return await scan(checkout, registry);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
};

const githubRepos = (root: string, organization: string) => {
  if (!/^[a-z0-9][a-z0-9-]*$/iu.test(organization)) {
    throw new Error("Provide a GitHub organization name.");
  }

  const output = execFileSync(
    "gh",
    [
      "api",
      "--hostname",
      "github.com",
      "--paginate",
      "--slurp",
      `orgs/${organization}/repos?per_page=100`,
    ],
    { cwd: root, encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 },
  );

  const pages = Schema.decodeUnknownSync(
    Schema.Array(
      Schema.Array(
        Schema.Struct({
          full_name: Schema.String,
          clone_url: Schema.String,
        }),
      ),
    ),
  )(parseJson(output));

  return pages
    .flat()
    .toSorted((left, right) => left.full_name.localeCompare(right.full_name, "en"));
};

export const usage = async (
  cwd: string,
  location: string,
  offline: boolean,
  repo: string,
  github: string,
) => {
  if (repo.length > 0 && github.length > 0) {
    throw new Error("Use either --repo or --github.");
  }

  const root = await realpath(cwd);
  const registry = offline ? undefined : await openRegistry(root, location);

  if (repo.length === 0 && github.length === 0) {
    return await scan(root, registry);
  }

  if (repo.length > 0) {
    return await scanRemote(root, registry, repo);
  }

  const projects: Awaited<ReturnType<typeof scan>> = [];

  for (const repository of githubRepos(root, github)) {
    // oxlint-disable-next-line eslint/no-await-in-loop -- Bound simultaneous clones and disk usage.
    const found = await scanRemote(root, registry, repository.clone_url);

    projects.push(
      ...found.map((project) => ({
        ...project,
        project:
          project.project === "."
            ? repository.full_name
            : `${repository.full_name}/${project.project}`,
      })),
    );
  }

  return projects;
};
