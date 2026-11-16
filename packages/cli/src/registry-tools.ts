import { once } from "node:events";
import { cp, mkdir, readFile, realpath, rm } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import * as Schema from "effect/Schema";
import { importSpecifiers } from "./imports.ts";
import { atomicWrite, safePath } from "./project.ts";
import { publishRevisions } from "./publish.ts";
import type { RegistrySource } from "./publish.ts";
import { writeRegistrySite } from "./registry-site.ts";
import { normalizeItem, openRegistry } from "./registry.ts";
import { parseJson, snapshotFor } from "./revision.ts";
import type { Snapshot } from "./revision.ts";

const decodeCatalog = Schema.decodeUnknownSync(
  Schema.Struct({
    items: Schema.Array(Schema.Record(Schema.String, Schema.Json)),
  }),
);

const itemName = Schema.decodeUnknownSync(Schema.Struct({ name: Schema.String }));
const sourceFile = /\.[cm]?[jt]sx?$/u;
const canonicalPrefix = "@/registry/erbium/";
const moduleExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".css"];

const resolvesModule = (targets: ReadonlySet<string>, target: string) => {
  const stem = target.replace(/\.jsx?$/u, "");

  return (
    targets.has(target) ||
    moduleExtensions.some(
      (extension) => targets.has(stem + extension) || targets.has(`${target}/index${extension}`),
    )
  );
};

const validateImports = (
  id: string,
  files: readonly { target: string; content: string }[],
  targets: ReadonlySet<string>,
) => {
  for (const file of files) {
    if (!sourceFile.test(file.target)) {
      continue;
    }

    for (const specifier of importSpecifiers(file.content)) {
      let target: string;

      if (specifier.startsWith(canonicalPrefix)) {
        const name = specifier.slice(canonicalPrefix.length);
        target = name.startsWith("blocks/") ? `@components/${name}` : `@${name}`;
      } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
        // Different shadcn aliases can point to unrelated directories.
        target = path.posix.join(path.posix.dirname(file.target), specifier);
      } else {
        continue;
      }

      if (!resolvesModule(targets, target)) {
        throw new Error(
          `Unresolved registry import ${specifier} in ${id} (${file.target}). Declare the item that ships it as a registry dependency.`,
        );
      }
    }
  }
};

const validateSnapshots = (items: readonly Snapshot[]) => {
  const seen = new Set<string>();

  for (const { id, item } of items) {
    if (seen.has(id)) {
      throw new Error(`Duplicate registry item ${id}.`);
    }

    seen.add(id);
    const targets = new Set<string>();

    for (const { target } of item.files ?? []) {
      if (
        targets.has(target) ||
        !/^(?:@(?:ui|components|hooks|lib)|~)\/.+/u.test(target) ||
        /(?:^|\/)\.\.?(?:\/|$)|\\|\/\//u.test(target)
      ) {
        throw new Error(`Invalid or duplicate target ${target} in ${id}.`);
      }

      targets.add(target);
    }
  }

  const byId = new Map(items.map(({ id, item }) => [id, item]));
  const visited = new Map<string, ReadonlySet<string>>();
  const active = new Set<string>();

  const visit = (id: string): ReadonlySet<string> => {
    const cached = visited.get(id);

    if (cached !== undefined) {
      return cached;
    }

    if (active.has(id)) {
      throw new Error(`Registry dependency cycle at ${id}.`);
    }

    const item = byId.get(id);

    if (item === undefined) {
      throw new Error(`Missing registry dependency ${id}.`);
    }

    active.add(id);

    const files = item.files ?? [];
    const targets = new Set(files.map(({ target }) => target));

    for (const child of item.registryDependencies ?? []) {
      for (const target of visit(normalizeItem(child))) {
        targets.add(target);
      }
    }

    validateImports(id, files, targets);
    active.delete(id);
    visited.set(id, targets);

    return targets;
  };

  for (const id of byId.keys()) {
    visit(id);
  }

  return items.length;
};

export const validateRegistry = async (cwd: string, location: string) => {
  const registry = await openRegistry(cwd, location);

  const entries = Object.entries(registry.items);
  const items: Snapshot[] = [];
  const batchSize = 16;

  for (let start = 0; start < entries.length; start += batchSize) {
    const batch = entries.slice(start, start + batchSize);

    // oxlint-disable-next-line eslint/no-await-in-loop -- Bound simultaneous HTTP and file requests.
    const snapshots = await Promise.all(
      batch.map(async ([id, digest]) => await registry.load(normalizeItem(id), digest)),
    );

    items.push(...snapshots);
  }

  return validateSnapshots(items);
};

const storyIndex = Schema.decodeUnknownSync(
  Schema.Struct({
    entries: Schema.Record(
      Schema.String,
      Schema.Struct({
        id: Schema.String,
        type: Schema.String,
        importPath: Schema.String,
        name: Schema.String,
      }),
    ),
  }),
);

const usageReport = Schema.decodeUnknownSync(
  Schema.Array(
    Schema.Struct({
      project: Schema.String,
      items: Schema.Array(Schema.Struct({ id: Schema.String })),
    }),
  ),
);

const verificationReport = Schema.decodeUnknownSync(
  Schema.Struct({
    ok: Schema.Boolean,
    steps: Schema.Array(
      Schema.Struct({
        step: Schema.String,
        ok: Schema.Boolean,
        notes: Schema.Array(Schema.String),
      }),
    ),
  }),
);

const readReport = async (cwd: string, file: string, validate: (json: Schema.Json) => object) => {
  if (!file) {
    return null;
  }

  const content = await readFile(path.resolve(cwd, file), "utf-8");
  validate(parseJson(content));

  return content;
};

const readStorybook = async (cwd: string, directory: string, output: string) => {
  if (!directory) {
    return null;
  }

  const source = await realpath(path.resolve(cwd, directory));
  const destination = path.join(await realpath(output).catch(() => output), "storybook");

  if (
    source === destination ||
    source.startsWith(destination + path.sep) ||
    destination.startsWith(source + path.sep)
  ) {
    throw new Error("Keep the Storybook input and output directories separate.");
  }

  const [index] = await Promise.all([
    readFile(path.join(source, "index.json"), "utf-8"),
    readFile(path.join(source, "iframe.html")),
  ]);

  const { entries } = storyIndex(parseJson(index));
  const previews = new Map<string, string>();

  for (const entry of Object.values(entries)) {
    const match = /(?:^|\/)(?<name>[a-z0-9-]+)\.stories\.[cm]?[jt]sx?$/u.exec(entry.importPath);
    const name = match?.groups?.name;

    if (
      entry.type === "story" &&
      name !== undefined &&
      (!previews.has(name) || entry.name === "Default")
    ) {
      previews.set(name, entry.id);
    }
  }

  return { source, destination, previews };
};

interface BuildOptions {
  cwd: string;
  input: string;
  examples: string;
  out: string;
  history: boolean;
  noSite: boolean;
  storybook: string;
  usage: string;
  verify: string;
}

export const buildRegistry = async ({
  cwd,
  input,
  examples,
  out,
  history,
  noSite,
  storybook,
  usage,
  verify,
}: BuildOptions) => {
  const output = path.resolve(cwd, out);
  const sources: RegistrySource[] = [["erbium", path.resolve(cwd, input)]];

  if (examples.length > 0) {
    sources.push(["erbium-examples", path.resolve(cwd, examples)]);
  }

  const catalogs = await Promise.all(
    sources.map(async ([namespace, file]) => {
      const text = await readFile(file, "utf-8");
      const { items } = decodeCatalog(parseJson(text));

      const records = items.map((item) => {
        const { name } = itemName(item);
        const id = normalizeItem(`@${namespace}/${name}`);

        if (name === "registry") {
          throw new Error(`Registry item ${id} conflicts with the catalog filename.`);
        }

        return { name, item, snapshot: snapshotFor(id, item) };
      });

      return { namespace, text, records };
    }),
  );

  const count = validateSnapshots(
    catalogs.flatMap(({ records }) => records.map(({ snapshot }) => snapshot)),
  );

  const [stories, usageJson, verifyJson] = await Promise.all([
    readStorybook(cwd, noSite ? "" : storybook, output),
    readReport(cwd, noSite ? "" : usage, usageReport),
    readReport(cwd, noSite ? "" : verify, verificationReport),
  ]);

  const managed = path.join(output, "r", "erbium");

  const historySources = history
    ? await Promise.all(
        sources.map(async ([namespace, file]) => [namespace, await realpath(file)] as const),
      )
    : sources;

  await publishRevisions(managed, history, historySources, cwd);

  await Promise.all(
    catalogs.map(async ({ namespace, text, records }) => {
      const target = path.join(output, "r", namespace === "erbium" ? "ui" : "examples");
      await mkdir(target, { recursive: true });
      await Promise.all(
        records.map(async ({ name, item }) => {
          await atomicWrite(
            path.join(target, `${name}.json`),
            `${JSON.stringify({
              ...item,
              $schema: "https://ui.shadcn.com/schema/registry-item.json",
            })}\n`,
          );
        }),
      );
      await atomicWrite(path.join(target, "registry.json"), text);
    }),
  );

  await Promise.all([
    rm(await safePath(output, "storybook"), { recursive: true, force: true }),
    rm(await safePath(output, "usage.json"), { force: true }),
    rm(await safePath(output, "verify.json"), { force: true }),
    ...(noSite
      ? [
          rm(await safePath(output, "index.html"), { force: true }),
          rm(await safePath(output, "llms.txt"), { force: true }),
          rm(await safePath(output, "items"), { recursive: true, force: true }),
        ]
      : []),
  ]);

  if (!noSite) {
    await Promise.all([
      stories === null ? undefined : cp(stories.source, stories.destination, { recursive: true }),
      usageJson === null ? undefined : atomicWrite(path.join(output, "usage.json"), usageJson),
      verifyJson === null ? undefined : atomicWrite(path.join(output, "verify.json"), verifyJson),
      writeRegistrySite(output, managed, {
        previews: stories?.previews,
        usage: usageJson !== null,
        verify: verifyJson !== null,
      }),
    ]);
  }

  return { output, count };
};

const routes =
  /^\/(?<file>index\.html|llms\.txt|usage\.json|verify\.json|storybook\/.+|items\/(?:erbium|erbium-examples)\/[a-z0-9-]+\.html|r\/(?:erbium\/(?:index\.json|history\.json|revisions\/[a-f0-9]{64}\.json)|(?:ui|examples)\/[a-z0-9-]+\.json))$/u;

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".wasm", "application/wasm"],
]);

export const serveRegistry = async (
  cwd: string,
  directory: string,
  port: number,
  signal: AbortSignal,
) => {
  const root = path.resolve(cwd, directory);

  const server = createServer((request, response) => {
    const [url = ""] = request.url?.split("?") ?? [];
    const route = url === "/" || url === "/storybook/" ? `${url}index.html` : url;
    let file: string | undefined;

    try {
      file = routes.exec(decodeURIComponent(route))?.groups?.file;
    } catch {
      response.writeHead(400).end();

      return;
    }

    if (file === undefined || (request.method !== "GET" && request.method !== "HEAD")) {
      response.writeHead(404).end();

      return;
    }

    const send = async () => {
      const content = await readFile(await safePath(root, file));
      const type = contentTypes.get(path.extname(file)) ?? "application/octet-stream";

      response
        .writeHead(200, { "Content-Type": type, "Content-Length": content.length })
        .end(request.method === "HEAD" ? undefined : content);
    };

    send().catch(() => {
      response.writeHead(404).end();
    });
  });

  signal.throwIfAborted();
  const closed = once(server, "close");
  server.listen({ port, host: "127.0.0.1", signal });
  await closed;
};
