import * as Schema from "effect/Schema";
import { atomicWrite, loadLock, lockPath, validateAliases, readText, safePath } from "./project.ts";
import { defaultRegistry, normalizeItem, openRegistry } from "./registry.ts";
import { parseJson } from "./revision.ts";

const docsSite = "https://ui.erbium.app";
const configRecord = Schema.decodeUnknownSync(Schema.Record(Schema.String, Schema.Json));

const pageIndex = Schema.decodeUnknownSync(
  Schema.Struct({
    pages: Schema.Array(
      Schema.Struct({
        route: Schema.String,
        title: Schema.String,
        markdownUrl: Schema.String,
      }),
    ),
  }),
);

const skillPath = ".agents/skills/erbium-ui/SKILL.md";

const agentBlock =
  "<!-- erbium-ui:begin -->\nUse the local Erbium UI skill in `.agents/skills/erbium-ui/SKILL.md` for component discovery and managed installs.\n<!-- erbium-ui:end -->";

const fetchText = async (url: URL) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });

  if (!response.ok) {
    throw new Error(`Documentation returned HTTP ${response.status} for ${url.pathname}.`);
  }

  return await response.text();
};

export const initialize = async (root: string, agents: boolean) => {
  await validateAliases(root);
  const componentsPath = await safePath(root, "components.json");
  const config = configRecord(parseJson((await readText(componentsPath)) ?? "{}"));
  const configured = configRecord(config.registries ?? {});
  const lock = await safePath(root, lockPath);
  await loadLock(root);

  const defaults = {
    "@erbium": `${docsSite}/r/ui/{name}.json`,
    "@erbium-examples": `${docsSite}/r/examples/{name}.json`,
  };

  const changed: string[] = [];

  if (Object.keys(defaults).some((namespace) => !Object.hasOwn(configured, namespace))) {
    await atomicWrite(
      componentsPath,
      `${JSON.stringify({ ...config, registries: { ...defaults, ...configured } }, null, 2)}\n`,
    );
    changed.push("components.json");
  }

  if ((await readText(lock)) === undefined) {
    await atomicWrite(lock, '{ "version": 1, "items": {} }\n');
    changed.push(lockPath);
  }

  if (agents) {
    const skill = await safePath(root, skillPath);
    const instructions = await safePath(root, "AGENTS.md");
    const existing = (await readText(instructions)) ?? "";

    if ((await readText(skill)) === undefined) {
      await atomicWrite(
        skill,
        `---\nname: erbium-ui\ndescription: Find, install, and update Erbium UI source.\n---\n\nUse \`erbium search\` and \`erbium docs\` before creating UI. Install with \`erbium add\`, or use shadcn and then \`erbium adopt\`. Commit the tracked source and its provenance. Review \`erbium diff\` before updating and run \`erbium check\` after editing.\n\nRead ${docsSite}/docs/installation.md for setup.\n`,
      );
      changed.push(skillPath);
    }

    if (!existing.includes("<!-- erbium-ui:begin -->")) {
      const prefix = existing.length === 0 ? "" : `${existing.trimEnd()}\n\n`;
      await atomicWrite(instructions, `${prefix}${agentBlock}\n`);
      changed.push("AGENTS.md");
    }
  }

  return changed;
};

export const search = async (root: string, location: string, terms: readonly string[]) => {
  const registry = await openRegistry(root, location);
  const words = terms.map((term) => term.toLowerCase());

  const matches = Object.entries(registry.items).flatMap(([id, revision]) => {
    const metadata = registry.catalog[id];
    const name = id.split("/")[1] ?? id;
    const title = metadata?.title?.toLowerCase() ?? "";

    const content = [id, title, metadata?.description, ...(metadata?.keywords ?? [])]
      .join(" ")
      .toLowerCase();

    if (!words.every((word) => content.includes(word))) {
      return [];
    }

    let score = 0;

    for (const word of words) {
      if (word === id || word === name || word === title) {
        score += 4;
      } else {
        score += name.includes(word) || title.includes(word) ? 2 : 1;
      }
    }

    return [{ score, item: { id, revision, ...metadata } }];
  });

  return matches.toSorted((left, right) => right.score - left.score).map(({ item }) => item);
};

export const registryDocumentation = async (cwd: string, location: string, topic: string) => {
  const registry = await openRegistry(cwd, location);
  const id = normalizeItem(topic);
  const digest = registry.items[id];

  if (digest === undefined) {
    throw new Error(`No registry item found for ${id}. Use erbium search to discover items.`);
  }

  const { item } = await registry.load(id, digest);
  const info = registry.catalog[id];

  const dependencies = [
    ...(item.registryDependencies ?? []),
    ...(item.dependencies ?? []),
    ...(item.devDependencies ?? []),
  ];

  const files = (item.files ?? []).map(({ target, content }) => {
    let width = 3;

    for (const [run] of content.matchAll(/`+/gu)) {
      width = Math.max(width, run.length + 1);
    }

    const fence = "`".repeat(width);

    return `## ${target}\n\n${fence}\n${content}\n${fence}`;
  });

  return [
    `# ${info?.title ?? id}`,
    info?.description,
    `Revision: ${digest}`,
    dependencies.length === 0 ? undefined : `Dependencies: ${dependencies.join(", ")}`,
    ...files,
  ]
    .filter(Boolean)
    .join("\n\n");
};

export const documentation = async (topic: string, site: string) => {
  const origin = new URL(site);
  const index = pageIndex(parseJson(await fetchText(new URL("/api/docs.json", origin))));
  const name = topic.split("/").at(-1);

  const match =
    index.pages.find((page) => page.route === topic) ??
    index.pages.find((page) => page.route.split("/").at(-1) === name);

  if (match === undefined) {
    throw new Error(`No documentation found for ${topic}. Use erbium search to discover items.`);
  }

  const url = new URL(new URL(match.markdownUrl, origin).pathname, origin);

  return await fetchText(url);
};

export const history = async (root: string, location: string, item: string) => {
  const registry = await openRegistry(root, location);
  const id = normalizeItem(item);
  const current = registry.items[id];
  const releases = await registry.history();
  let previous: string | undefined;

  const entries = releases
    .toReversed()
    .flatMap(({ commit, date, items }) => {
      const revision = items[id];
      const changed = revision !== previous;
      previous = revision;

      return revision !== undefined && changed
        ? [{ id, revision, commit, date, current: revision === current }]
        : [];
    })
    .toReversed();

  if (current !== undefined && entries[0]?.revision !== current) {
    return [{ id, revision: current, commit: null, date: null, current: true }, ...entries];
  }

  return entries;
};

export const defaultDocs = new URL(defaultRegistry).origin;
