import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as Schema from "effect/Schema";
import { atomicWrite } from "./project.ts";
import { normalizeItem } from "./registry.ts";
import { parseJson, revision, snapshotFor } from "./revision.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

const decodeCatalog = Schema.decodeUnknownSync(
  Schema.Struct({ items: Schema.Array(Schema.Record(Schema.String, Schema.Json)) }),
);

const itemName = Schema.decodeUnknownSync(Schema.Struct({ name: Schema.String }));

// Catalogs from this commit onward are eligible for adoption and baseline lookup.
const firstRegistryCommit = "886b33bb9fb8d66dfd5e6a9a2ffe687ac341b88a";

const catalogs = [
  ["erbium", "packages/ui/public/r/registry.json"],
  ["erbium-examples", "packages/showcase/public/r/registry.json"],
] as const;

const gitAt = (cwd: string, args: string[]): string =>
  execFileSync("git", args, { cwd, encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 });

const historyPaths = (directory: string, sources: readonly RegistrySource[]) =>
  sources.map(([namespace, file]) => {
    const relative = path.relative(directory, path.resolve(directory, file));

    if (relative.startsWith(`..${path.sep}`) || relative === ".." || relative === "") {
      throw new Error(`Catalog must be inside the Git checkout to publish history: ${file}`);
    }

    return [namespace, relative.split(path.sep).join("/")] as const;
  });

export type RegistrySource = readonly [namespace: string, catalog: string];

export const publishRevisions = async (
  output: string,
  history: boolean,
  sources: readonly RegistrySource[] = catalogs,
  checkout?: string,
): Promise<void> => {
  const revisions = path.join(output, "revisions");
  await mkdir(revisions, { recursive: true });
  const written = new Set<string>();

  const catalog: Record<
    string,
    { title?: string; description?: string; keywords?: readonly string[] }
  > = {};

  const metadata = Schema.decodeUnknownSync(
    Schema.Struct({
      title: Schema.optionalKey(Schema.String),
      description: Schema.optionalKey(Schema.String),
      keywords: Schema.optionalKey(Schema.Array(Schema.String)),
    }),
  );

  const items: Record<string, string> = {};

  const collect = (
    namespace: string,
    text: string,
    current: boolean,
    releaseItems?: Record<string, string>,
  ) => {
    const records = decodeCatalog(parseJson(text)).items;
    const snapshots = [];
    const seen = new Set<string>();

    for (const record of records) {
      const id = normalizeItem(`@${namespace}/${itemName(record).name}`);

      if (seen.has(id)) {
        throw new Error(`Duplicate registry item ${id}.`);
      }

      seen.add(id);
      const value = snapshotFor(id, record);
      const digest = revision(value);

      if (current) {
        items[id] = digest;
        catalog[id] = metadata(record);
      }

      if (releaseItems !== undefined) {
        releaseItems[id] = digest;
      }

      if (!written.has(digest)) {
        written.add(digest);
        snapshots.push({ digest, value });
      }
    }

    return snapshots;
  };

  const directory =
    history && checkout !== undefined
      ? gitAt(checkout, ["rev-parse", "--show-toplevel"]).trim()
      : root;

  const git = (args: string[]) => gitAt(directory, args);
  const files = history ? historyPaths(directory, sources) : [];

  if (history && git(["rev-parse", "--is-shallow-repository"]).trim() !== "false") {
    throw new Error("Registry publishing requires full Git history. Use fetch-depth: 0.");
  }

  const current = await Promise.all(
    sources.map(async ([namespace, file]) =>
      collect(namespace, await readFile(path.resolve(root, file), "utf-8"), true),
    ),
  );

  const commits = history
    ? git([
        "--literal-pathspecs",
        "log",
        "--first-parent",
        "--full-history",
        "--format=%H",
        ...(checkout === undefined ? [`${firstRegistryCommit}..HEAD`] : ["HEAD"]),
        "--",
        ...files.map(([, file]) => file),
      ])
        .trim()
        .split("\n")
        .filter(Boolean)
    : [];

  if (history && checkout === undefined) {
    commits.push(firstRegistryCommit);
  } else if (history && commits.length === 0) {
    throw new Error(
      "No committed catalog history found. Commit the catalog before publishing history.",
    );
  }

  const releases = commits.map((commit) => ({
    commit,
    date: git(["show", "-s", "--format=%cI", commit]).trim(),
    items: Object.fromEntries<string>([]),
  }));

  const previous = releases.flatMap((release) =>
    files.flatMap(([namespace, file]) =>
      git(["--literal-pathspecs", "ls-tree", release.commit, "--", file]).length === 0
        ? []
        : collect(namespace, git(["show", `${release.commit}:${file}`]), false, release.items),
    ),
  );

  await Promise.all(
    [...current.flat(), ...previous].map(async ({ digest, value }) => {
      await writeFile(path.join(revisions, `${digest}.json`), `${JSON.stringify(value)}\n`, {
        flag: "wx",
      }).catch(async () => {
        const existing = await readFile(path.join(revisions, `${digest}.json`), "utf-8");

        if (existing !== `${JSON.stringify(value)}\n`) {
          throw new Error(`Published snapshot differs from revision ${digest}.`);
        }
      });
    }),
  );

  let last: Record<string, string> = {};

  const changes = releases
    .toReversed()
    .map(({ commit, date, items: published }) => {
      const ids = new Set([...Object.keys(last), ...Object.keys(published)]);

      const changed = Object.fromEntries(
        [...ids].flatMap((id) => (last[id] === published[id] ? [] : [[id, published[id] ?? null]])),
      );

      last = published;

      return { commit, date, changes: changed };
    })
    .toReversed();

  await atomicWrite(path.join(output, "history.json"), `${JSON.stringify(changes)}\n`);

  const ordered = Object.fromEntries(
    Object.entries(items).toSorted(([left], [right]) => left.localeCompare(right, "en")),
  );

  await atomicWrite(
    path.join(output, "index.json"),
    `${JSON.stringify({
      version: 1,
      items: ordered,
      catalog: Object.fromEntries(Object.keys(ordered).map((id) => [id, catalog[id]])),
    })}\n`,
  );
};
