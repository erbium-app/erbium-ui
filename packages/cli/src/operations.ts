import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import * as Schema from "effect/Schema";
import {
  atomicWrite,
  loadLock,
  lockPath,
  planFiles,
  projectConfig,
  validateAliases,
  readText,
  safePath,
} from "./project.ts";
import { importSpecifiers, resolveLocalImport } from "./imports.ts";
import type { Lock, LockedItem } from "./project.ts";
import { normalizeItem, openRegistry } from "./registry.ts";
import { hash, parseJson, revision } from "./revision.ts";
import type { Snapshot } from "./revision.ts";

type Mode = "add" | "adopt" | "update" | "diff" | "status" | "check";

interface Options {
  cwd: string;
  registry: string;
  names: readonly string[];
  dryRun: boolean;
  local: boolean;
  at?: string;
  only?: string;
}

type Registry = Awaited<ReturnType<typeof openRegistry>>;

const markers = /^(?:<{7} yours|>{7} upstream)(?:\r?$)/mu;

const packageName =
  /^(?<name>@[a-z\d][a-z\d._-]*\/[a-z\d][a-z\d._-]*|[a-z\d][a-z\d._-]*)(?:@(?<range>[^\s]+))?$/iu;

const packageManifest = Schema.decodeUnknownSync(
  Schema.Struct({
    packageManager: Schema.optionalKey(Schema.String),
    dependencies: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
    devDependencies: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
    peerDependencies: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
    optionalDependencies: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
  }),
);

const journalSchema = Schema.decodeUnknownSync(
  Schema.Array(
    Schema.Struct({
      target: Schema.String,
      content: Schema.String,
      previous: Schema.NullOr(Schema.String),
    }),
  ),
);

const basePath = (digest: string): string => `.erbium/bases/${digest}.txt`;

const readBase = async (
  root: string,
  digest: string,
  target: string,
  local?: string,
  recover?: () => Promise<string | null | undefined>,
): Promise<string> => {
  if (local !== undefined && hash(local) === digest) {
    return local;
  }

  const base = await readText(await safePath(root, basePath(digest)));

  if (base !== undefined && hash(base) === digest) {
    return base;
  }

  const history = spawnSync("git", ["log", "--format=%H", "--", target], {
    cwd: root,
    encoding: "utf-8",
  });

  const refs = [
    `:./${target}`,
    ...(history.stdout ?? "")
      .split("\n")
      .filter(Boolean)
      .map((commit) => `${commit}:./${target}`),
  ];

  for (const ref of refs) {
    const candidate = spawnSync("git", ["show", ref], {
      cwd: root,
      encoding: "utf-8",
      maxBuffer: 16 * 1024 * 1024,
    });

    if (candidate.status === 0 && hash(candidate.stdout) === digest) {
      return candidate.stdout;
    }
  }

  const fromRegistry = await recover?.();

  if (fromRegistry !== undefined && fromRegistry !== null && hash(fromRegistry) === digest) {
    return fromRegistry;
  }

  throw new Error(
    `Missing or invalid baseline for ${target} (${digest}). Restore .erbium/bases from version control.`,
  );
};

const readTracked = async (root: string, target: string): Promise<string | undefined> =>
  await readText(await safePath(root, target));

const gitFile = async (mode: "merge" | "diff", local: string, base: string, upstream: string) => {
  const directory = await mkdtemp(path.join(tmpdir(), "erbium-"));

  try {
    await Promise.all([
      writeFile(path.join(directory, "local"), local),
      writeFile(path.join(directory, "base"), base),
      writeFile(path.join(directory, "upstream"), upstream),
    ]);

    const args =
      mode === "merge"
        ? [
            "merge-file",
            "-p",
            "-L",
            "yours",
            "-L",
            "base",
            "-L",
            "upstream",
            "local",
            "base",
            "upstream",
          ]
        : ["diff", "--no-index", "--no-color", "--", "base", "upstream"];

    const result = spawnSync("git", args, {
      cwd: directory,
      encoding: "utf-8",
      maxBuffer: 16 * 1024 * 1024,
    });

    if (
      result.error !== undefined ||
      result.status === null ||
      result.status < 0 ||
      result.status > (mode === "merge" ? 127 : 1)
    ) {
      throw new Error(`git ${args[0]} failed: ${result.error?.message ?? result.stderr}`);
    }

    return { content: result.stdout, conflict: mode === "merge" && result.status !== 0 };
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
};

const selectItems = async (
  registry: Registry,
  names: readonly string[],
  installed: Readonly<Record<string, LockedItem>>,
) => {
  const requested = new Set(names);
  const pending = new Set<string>();
  const selected = new Map<string, Snapshot>();

  const visit = async (id: string): Promise<void> => {
    if (selected.has(id) || (Object.hasOwn(installed, id) && !requested.has(id))) {
      return;
    }

    if (pending.has(id)) {
      throw new Error(`Cyclic dependency at ${id}.`);
    }

    const digest = registry.items[id];

    if (digest === undefined) {
      throw new Error(`Item is missing from the registry: ${id}`);
    }

    pending.add(id);
    const value = await registry.load(id, digest);

    // Dependency traversal shares the active stack for cycle detection.
    for (const dependency of value.item.registryDependencies ?? []) {
      // oxlint-disable-next-line eslint/no-await-in-loop -- Finish this dependency before visiting a sibling.
      await visit(normalizeItem(dependency));
    }

    pending.delete(id);
    selected.set(id, value);
  };

  for (const name of names) {
    // oxlint-disable-next-line eslint/no-await-in-loop -- Root items share the dependency graph and active stack.
    await visit(name);
  }

  return selected;
};

const snapshotBaselines = (
  root: string,
  config: Awaited<ReturnType<typeof projectConfig>>,
  registry: Registry,
  items: Readonly<Record<string, LockedItem>>,
) => {
  const cache = new Map<string, Promise<ReturnType<typeof planFiles>>>();

  return async (id: string, target: string, digest: string): Promise<string | null | undefined> => {
    const item = items[id];

    if (item === undefined) {
      return null;
    }

    let files = cache.get(id);

    if (files === undefined) {
      files = registry
        .load(id, item.revision)
        .then((snapshot) => planFiles(root, config, snapshot))
        .catch(() => []);
      cache.set(id, files);
    }

    const resolved = await files;

    return resolved.find((file) => file.target === target && hash(file.content) === digest)
      ?.content;
  };
};

const plannedContent = async (
  mode: Mode,
  root: string,
  target: string,
  upstream: string,
  previous?: string,
  recover?: () => Promise<string | null | undefined>,
) => {
  const local = await readTracked(root, target);

  if (mode === "adopt") {
    if (local !== upstream) {
      throw new Error(`Cannot adopt ${target}: it differs from the selected revision.`);
    }

    return { local, content: local };
  }

  if (local === undefined) {
    if (previous !== undefined) {
      throw new Error(`Tracked file is missing: ${target}. Restore it before updating.`);
    }

    return { local, content: upstream };
  }

  if (markers.test(local)) {
    throw new Error(`Resolve the merge markers in ${target} first.`);
  }

  const localHash = hash(local);
  const upstreamHash = hash(upstream);

  if (previous !== undefined && (local === upstream || upstreamHash === previous)) {
    return { local, content: local };
  }

  if (localHash === previous) {
    return { local, content: upstream };
  }

  if (previous === undefined) {
    throw new Error(
      `Unmanaged file already exists: ${target}. Adopt a matching install or move the file before adding.`,
    );
  }

  const base = await readBase(root, previous, target, local, recover);
  const merged = await gitFile("merge", local, base, upstream);

  if (merged.conflict) {
    throw new Error(
      `Both sides edited the same lines in ${target}. Run erbium diff and erbium diff --local to review.`,
    );
  }

  return { local, content: merged.content };
};

const packageSpecs = (specs: readonly string[]) =>
  specs.map((spec) => {
    const match = packageName.exec(spec);

    const name = match?.groups?.name;
    const range = match?.groups?.range;

    if (name === undefined || (range !== undefined && !/^[~^*<>=|.\w+-]+$/u.test(range))) {
      throw new Error(`Unsupported npm package specification: ${spec}`);
    }

    return { name, spec };
  });

const packagePlan = async (root: string, items: Iterable<LockedItem>) => {
  const text = await readText(path.join(root, "package.json"));

  if (text === undefined) {
    throw new Error("Run Erbium in a project with package.json.");
  }

  const manifest = packageManifest(parseJson(text));

  const declared = {
    ...manifest.peerDependencies,
    ...manifest.optionalDependencies,
    ...manifest.devDependencies,
    ...manifest.dependencies,
  };

  const required = new Map<string, { spec: string; dev: boolean }>();

  for (const item of items) {
    const entries = [
      ...packageSpecs(item.devDependencies).map((entry) => ({ ...entry, dev: true })),
      ...packageSpecs(item.dependencies).map((entry) => ({ ...entry, dev: false })),
    ];

    for (const { name, spec, dev } of entries) {
      const previous = required.get(name);

      if (
        previous !== undefined &&
        previous.spec !== name &&
        spec !== name &&
        previous.spec !== spec
      ) {
        throw new Error(
          `Registry items require different ranges of ${name}: ${previous.spec}, ${spec}.`,
        );
      }

      required.set(name, {
        dev: dev && (previous?.dev ?? true),
        spec: spec === name ? (previous?.spec ?? spec) : spec,
      });
    }
  }

  const missing = [...required].filter(([name]) => !Object.hasOwn(declared, name));

  const ranges = [...required].flatMap(([name, { spec }]) => {
    const current = declared[name];

    return current !== undefined && spec !== name && spec !== `${name}@${current}`
      ? [`${name} is declared as ${current}; the registry requests ${spec}.`]
      : [];
  });

  let manager = manifest.packageManager?.split("@")[0];

  if (manager === undefined) {
    const files = [
      ["bun.lock", "bun"],
      ["pnpm-lock.yaml", "pnpm"],
      ["yarn.lock", "yarn"],
    ];

    const present = await Promise.all(
      files.map(async ([file, candidate]) => ({
        candidate,
        exists: (await readText(path.join(root, file))) !== undefined,
      })),
    );

    manager = present.find((file) => file.exists)?.candidate;
  }

  manager ??= "npm";

  if (!["npm", "bun", "pnpm", "yarn"].includes(manager)) {
    throw new Error(`Unsupported package manager: ${manager}`);
  }

  return {
    manager,
    ranges,
    dependencies: missing
      .values()
      .filter(([, entry]) => !entry.dev)
      .map(([, entry]) => entry.spec)
      .toArray(),
    devDependencies: missing
      .values()
      .filter(([, entry]) => entry.dev)
      .map(([, entry]) => entry.spec)
      .toArray(),
  };
};

const installPackages = (root: string, packages: Awaited<ReturnType<typeof packagePlan>>) => {
  const { manager } = packages;

  const install = (specs: string[], dev: boolean) => {
    if (specs.length === 0) {
      return;
    }

    const args = [manager === "npm" ? "install" : "add", ...(dev ? ["-D"] : []), "--", ...specs];

    const result = spawnSync(manager, args, {
      cwd: root,
      encoding: "utf-8",
      maxBuffer: 16 * 1024 * 1024,
    });

    if (result.status !== 0 || result.error !== undefined) {
      throw new Error(
        `${manager} failed to install ${specs.join(", ")}: ${result.error?.message ?? result.stderr}`,
      );
    }
  };

  install(packages.dependencies, false);
  install(packages.devDependencies, true);
};

const finishJournal = async (root: string, journal: string) => {
  const text = await readText(journal);

  if (text === undefined) {
    return;
  }

  const writes = journalSchema(parseJson(text));

  const pending = await Promise.all(
    writes.map(async (write) => {
      const absolute = await safePath(root, write.target);
      const current = await readText(absolute);

      if (current !== (write.previous ?? undefined) && current !== write.content) {
        throw new Error(`Cannot resume interrupted update because ${write.target} changed.`);
      }

      return { absolute, ...write };
    }),
  );

  // Commit the lock after the source and baseline files are in place.
  for (const write of pending) {
    // oxlint-disable-next-line eslint/no-await-in-loop -- Ordered writes keep the lock last during recovery.
    await atomicWrite(write.absolute, write.content);
  }

  await rm(journal);
};

const inspect = async (
  root: string,
  registry: Registry | undefined,
  installed: Readonly<Record<string, LockedItem>>,
  names: readonly string[],
) => {
  const items = names.map((id) => {
    const item = installed[id];

    if (item === undefined) {
      throw new Error(`${id} is not tracked.`);
    }

    return { id, item };
  });

  return await Promise.all(
    items.map(async ({ id, item }) => {
      const files = await Promise.all(
        Object.entries(item.files).map(async ([target, digest]) => {
          const local = await readTracked(root, target);

          return {
            target,
            missing: local === undefined,
            modified: local !== undefined && hash(local) !== digest,
            conflict: local !== undefined && markers.test(local),
          };
        }),
      );

      const upstream = registry?.items[id];

      return {
        id,
        revision: item.revision,
        upstream,
        updateAvailable: upstream !== undefined && upstream !== item.revision,
        removed: registry !== undefined && upstream === undefined,
        files,
      };
    }),
  );
};

const diffItem = async (
  root: string,
  registry: Registry | undefined,
  names: readonly string[],
  items: Readonly<Record<string, LockedItem>>,
) => {
  const [id] = names;
  const item = id === undefined ? undefined : items[id];

  if (id === undefined || item === undefined || names.length !== 1) {
    throw new Error("Provide one tracked item to diff.");
  }

  const upstream = registry?.items[id];

  if (registry !== undefined && upstream === undefined) {
    throw new Error(`${id} is missing from the registry.`);
  }

  const config = registry === undefined ? undefined : await projectConfig(root);

  const recover =
    registry === undefined || config === undefined
      ? undefined
      : snapshotBaselines(root, config, registry, items);

  const incoming =
    registry !== undefined && upstream !== undefined && config !== undefined
      ? planFiles(root, config, await registry.load(id, upstream))
      : await Promise.all(
          Object.keys(item.files).map(async (target) => ({
            target,
            content: await readTracked(root, target),
          })),
        );

  const targets = new Map(incoming.map((file) => [file.target, file.content]));
  const files = [...new Set([...Object.keys(item.files), ...targets.keys()])];

  return await Promise.all(
    files.map(async (target) => {
      const previous = item.files[target];

      const base =
        previous === undefined
          ? ""
          : await readBase(
              root,
              previous,
              target,
              await readTracked(root, target),
              async () => await recover?.(id, target, previous),
            );

      const content = targets.get(target) ?? "";
      const result = await gitFile("diff", "", base, content);

      return { target, diff: result.content };
    }),
  );
};

const fileOwners = (items: Readonly<Record<string, LockedItem>>) => {
  const owners = new Map<string, { digest: string; items: string[] }>();

  for (const [id, item] of Object.entries(items)) {
    for (const [target, digest] of Object.entries(item.files)) {
      const owner = owners.get(target);

      if (owner !== undefined && owner.digest !== digest) {
        throw new Error(
          `Different revisions claim ${target}: ${owner.items.join(", ")}, ${id}. Update the affected items together.`,
        );
      }

      if (owner === undefined) {
        owners.set(target, { digest, items: [id] });
      } else {
        owner.items.push(id);
      }
    }
  }

  return owners;
};

const planItems = (
  mode: Mode,
  root: string,
  config: Awaited<ReturnType<typeof projectConfig>>,
  items: Readonly<Record<string, LockedItem>>,
  selected: ReadonlyMap<string, Snapshot>,
) => {
  const incoming = new Map<string, { id: string; upstream: string }>();
  const dropped: string[] = [];
  const next = { ...items };

  for (const [id, value] of selected) {
    const previous = items[id];
    const digest = revision(value);

    if (mode === "adopt" && previous !== undefined && previous.revision !== digest) {
      throw new Error(`${id} is already tracked. Use update.`);
    }

    const files: Record<string, string> = {};

    for (const { target, content } of planFiles(root, config, value)) {
      const shared = incoming.get(target);

      if (shared !== undefined && shared.upstream !== content) {
        throw new Error(`Registry items disagree on ${target}: ${shared.id}, ${id}.`);
      }

      incoming.set(target, { id, upstream: content });
      files[target] = hash(content);
    }

    dropped.push(
      ...Object.keys(previous?.files ?? {}).filter((target) => !Object.hasOwn(files, target)),
    );
    next[id] = {
      files,
      revision: digest,
      dependencies: value.item.dependencies ?? [],
      devDependencies: value.item.devDependencies ?? [],
      registryDependencies: value.item.registryDependencies ?? [],
    };
  }

  return { incoming, dropped, items: next };
};

const planChanges = async (
  root: string,
  mode: Mode,
  registry: Registry,
  names: readonly string[],
) => {
  const lock = await loadLock(root);
  const items = { ...lock.items };

  const requested =
    names.length > 0 || mode !== "update"
      ? names
      : Object.keys(items).filter(
          (id) => registry.items[id] !== undefined && registry.items[id] !== items[id]?.revision,
        );

  if (mode === "update" && requested.some((id) => !Object.hasOwn(items, id))) {
    throw new Error("Update takes tracked items. Use add to install new items.");
  }

  const selected = await selectItems(registry, requested, items);
  const config = await projectConfig(root);
  const owners = fileOwners(items);
  const plan = planItems(mode, root, config, items, selected);
  const nextOwners = fileOwners(plan.items);

  const recover = snapshotBaselines(root, config, registry, items);

  const planned = await Promise.all(
    [...plan.incoming].map(async ([target, { upstream }]) => {
      const owner = owners.get(target);
      const id = owner?.items[0];

      const recoverFile =
        owner === undefined || id === undefined
          ? undefined
          : async () => await recover(id, target, owner.digest);

      return {
        target,
        upstream,
        ...(await plannedContent(mode, root, target, upstream, owner?.digest, recoverFile)),
      };
    }),
  );

  const bases = new Map(planned.map(({ upstream }) => [hash(upstream), upstream]));

  const writes = planned.flatMap(({ target, local, content }) =>
    local === content ? [] : [{ target, previous: local, content }],
  );

  const dropped = [...new Set(plan.dropped)].filter((target) => !nextOwners.has(target));

  return { items: plan.items, writes, bases, dropped, selected: [...selected.keys()] };
};

const change = async (
  root: string,
  mode: Mode,
  options: Options,
  registry: Registry,
  names: readonly string[],
) => {
  const { items, writes, bases, dropped, selected } = await planChanges(
    root,
    mode,
    registry,
    names,
  );

  const packages = await packagePlan(root, Object.values(items));

  if (
    mode === "adopt" &&
    (packages.dependencies.length > 0 || packages.devDependencies.length > 0)
  ) {
    throw new Error("Install the missing package dependencies before adopting these files.");
  }

  if (!options.dryRun && selected.length > 0) {
    const baselineWrites = await Promise.all(
      [...bases].map(async ([digest, content]) => {
        const target = basePath(digest);
        const previous = await readTracked(root, target);

        return previous === content ? [] : [{ content, target, previous }];
      }),
    );

    writes.unshift(...baselineWrites.flat());
    const previous = await readTracked(root, lockPath);
    writes.push({
      content: `${JSON.stringify({ version: 1, items, aliases: await validateAliases(root) }, null, 2)}\n`,
      previous,
      target: lockPath,
    });

    if (mode !== "adopt") {
      installPackages(root, packages);
    }

    const journal = await safePath(root, ".erbium/pending.json");
    await atomicWrite(
      journal,
      JSON.stringify(writes.map((write) => ({ ...write, previous: write.previous ?? null }))),
    );
    await finishJournal(root, journal);
  }

  return {
    items: selected,
    files: writes
      .values()
      .map((write) => write.target)
      .filter((target) => !target.startsWith(".erbium/"))
      .toArray(),
    dropped,
    packages,
    dryRun: options.dryRun,
  };
};

const checkNames = ["config", "provenance", "dependencies", "imports"] as const;

type CheckStep = (typeof checkNames)[number];

const selectedChecks = (only: string) => {
  const valid = new Set<string>(checkNames);

  const requested =
    only.length === 0 ? [...checkNames] : [...new Set(only.split(",").map((name) => name.trim()))];

  if (requested.some((name) => !valid.has(name))) {
    throw new Error(`Unknown check. Choose from ${checkNames.join(", ")}.`);
  }

  return checkNames.filter((name) => requested.includes(name));
};

const verifyProvenance = async (root: string, items: Readonly<Record<string, LockedItem>>) => {
  const owners = fileOwners(items);
  await Promise.all(
    [...owners].map(async ([target, { digest }]) => {
      const local = await readTracked(root, target);

      if (local === undefined) {
        throw new Error(`Missing files: ${target}. Restore it before updating.`);
      }

      if (markers.test(local)) {
        throw new Error(`Unresolved merge conflict in ${target}.`);
      }

      await readBase(root, digest, target, local);
    }),
  );
};

const verifyDependencies = async (root: string, items: Readonly<Record<string, LockedItem>>) => {
  for (const [id, item] of Object.entries(items)) {
    normalizeItem(id);

    for (const dependency of item.registryDependencies) {
      if (!Object.hasOwn(items, dependency)) {
        throw new Error(
          `${id} requires untracked registry item ${dependency}. Run erbium add ${dependency}.`,
        );
      }
    }
  }

  const packages = await packagePlan(root, Object.values(items));
  const missing = [...packages.dependencies, ...packages.devDependencies];

  if (missing.length > 0) {
    throw new Error(`Missing package declarations: ${missing.join(", ")}.`);
  }

  return packages.ranges;
};

const verifyImports = async (root: string, items: Readonly<Record<string, LockedItem>>) => {
  const config = await projectConfig(root);
  const files = [...fileOwners(items).keys()].filter((target) => /\.[cm]?[jt]sx?$/u.test(target));

  const issues = await Promise.all(
    files.map(async (target) => {
      const file = await safePath(root, target);
      const text = (await readText(file)) ?? "";

      const imports = await Promise.all(
        importSpecifiers(text).map(async (specifier) => {
          const resolved = await resolveLocalImport(config, file, specifier);

          return resolved.expectedLocal && resolved.target === undefined
            ? [`${target} imports ${specifier}, which does not resolve.`]
            : [];
        }),
      );

      return imports.flat();
    }),
  );

  const broken = issues.flat();

  if (broken.length > 0) {
    throw new Error(broken.join("\n"));
  }
};

const validateInstall = async (root: string, lock: Lock, steps: readonly CheckStep[]) => {
  const { items } = lock;

  const checks = {
    config: async () => {
      const aliases = await validateAliases(root);

      if (
        lock.aliases !== undefined &&
        Object.entries(lock.aliases).some(([name, value]) => aliases[name] !== value)
      ) {
        throw new Error(
          "Alias destinations changed since installation. Restore them or migrate the tracked paths.",
        );
      }
    },
    provenance: async () => {
      await verifyProvenance(root, items);
    },
    dependencies: async () => await verifyDependencies(root, items),
    imports: async () => {
      await verifyImports(root, items);
    },
  };

  const results = await Promise.all(
    steps.map(async (step) => {
      try {
        const notes = await checks[step]();

        return { step, ok: true, notes: notes ?? [] };
      } catch (error) {
        return { step, ok: false, notes: [error instanceof Error ? error.message : String(error)] };
      }
    }),
  );

  return { ok: results.every((result) => result.ok), steps: results };
};

const operationRegistry = async (mode: Mode, root: string, options: Options) => {
  const registry =
    mode === "check" || (mode === "diff" && options.local)
      ? undefined
      : await openRegistry(root, options.registry);

  if (options.at === undefined || options.at.length === 0) {
    return registry;
  }

  if (mode !== "adopt" || registry === undefined) {
    throw new Error("--at is available for adopt.");
  }

  const releases = await registry.history();
  const { at } = options;
  const matching = releases.filter(({ commit }) => commit.startsWith(at));
  const [release] = matching;

  if (matching.length !== 1 || release === undefined) {
    throw new Error(`Expected one registry release matching ${at}. Run erbium history <item>.`);
  }

  return { ...registry, items: release.items };
};

export const runOperation = async (mode: Mode, options: Options) => {
  const root = await realpath(options.cwd);
  const names = options.names.map(normalizeItem);
  const journal = await safePath(root, ".erbium/pending.json");

  const registry = await operationRegistry(mode, root, options);

  if (mode === "check" || mode === "status" || mode === "diff") {
    if ((await readText(journal)) !== undefined) {
      throw new Error("An update was interrupted. Rerun the write command to finish it.");
    }

    const lock = await loadLock(root);
    const { items } = lock;

    if (mode === "diff") {
      return await diffItem(root, registry, names, items);
    }

    const results = await inspect(
      root,
      registry,
      items,
      names.length > 0 ? names : Object.keys(items),
    );

    if (mode === "check") {
      return {
        ...(await validateInstall(root, lock, selectedChecks(options.only ?? ""))),
        tracked: results,
      };
    }

    return results;
  }

  if (registry === undefined) {
    throw new Error("Registry required.");
  }

  if (options.dryRun) {
    if ((await readText(journal)) !== undefined) {
      throw new Error("An update was interrupted. Rerun the write command to finish it.");
    }

    return await change(root, mode, options, registry, names);
  }

  const guard = await safePath(root, ".erbium/operation");
  await mkdir(path.dirname(guard), { recursive: true });

  try {
    await mkdir(guard);
  } catch (error) {
    throw new Error(
      "An Erbium operation is active. If it was interrupted, remove the empty .erbium/operation directory and rerun.",
      { cause: error },
    );
  }

  try {
    await finishJournal(root, journal);

    return await change(root, mode, options, registry, names);
  } finally {
    await rm(guard, { recursive: true });
  }
};
