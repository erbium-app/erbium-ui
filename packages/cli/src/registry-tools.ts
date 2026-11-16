import { once } from "node:events";
import { mkdir, readFile, realpath } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import * as Schema from "effect/Schema";
import { importSpecifiers } from "./imports.ts";
import { atomicWrite, readText, safePath } from "./project.ts";
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

  const items = await Promise.all(
    Object.entries(registry.items).map(
      async ([id, digest]) => await registry.load(normalizeItem(id), digest),
    ),
  );

  return validateSnapshots(items);
};

export const buildRegistry = async (
  cwd: string,
  input: string,
  examples: string,
  out: string,
  history: boolean,
  noSite: boolean,
) => {
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

  if (!noSite) {
    await writeRegistrySite(output, managed);
  }

  return { output, count };
};

const routes =
  /^\/(?<file>index\.html|llms\.txt|items\/(?:erbium|erbium-examples)\/[a-z0-9-]+\.html|r\/(?:erbium\/(?:index\.json|history\.json|revisions\/[a-f0-9]{64}\.json)|(?:ui|examples)\/[a-z0-9-]+\.json))$/u;

export const serveRegistry = async (
  cwd: string,
  directory: string,
  port: number,
  signal: AbortSignal,
) => {
  const root = path.resolve(cwd, directory);

  const server = createServer((request, response) => {
    const [url = ""] = request.url?.split("?") ?? [];
    const file = routes.exec(url === "/" ? "/index.html" : url)?.groups?.file;

    if (file === undefined || (request.method !== "GET" && request.method !== "HEAD")) {
      response.writeHead(404).end();

      return;
    }

    const send = async () => {
      const content = await readText(await safePath(root, file));

      if (content === undefined) {
        response.writeHead(404).end();

        return;
      }

      let contentType = "application/json";

      if (file.endsWith(".html")) {
        contentType = "text/html";
      } else if (file.endsWith(".txt")) {
        contentType = "text/plain";
      }

      response
        .writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` })
        .end(request.method === "HEAD" ? undefined : content);
    };

    send().catch(() => {
      response.writeHead(500).end();
    });
  });

  signal.throwIfAborted();
  const closed = once(server, "close");
  server.listen({ port, host: "127.0.0.1", signal });
  await closed;
};
