import { once } from "node:events";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import * as Schema from "effect/Schema";
import { atomicWrite, readText, safePath } from "./project.ts";
import { publishRevisions } from "./publish.ts";
import type { RegistrySource } from "./publish.ts";
import { normalizeItem, openRegistry } from "./registry.ts";
import { parseJson, snapshotFor } from "./revision.ts";

const decodeCatalog = Schema.decodeUnknownSync(
  Schema.Struct({
    items: Schema.Array(Schema.Record(Schema.String, Schema.Json)),
  }),
);

const itemName = Schema.decodeUnknownSync(Schema.Struct({ name: Schema.String }));

export const validateRegistry = async (cwd: string, location: string) => {
  const registry = await openRegistry(cwd, location);

  const items = await Promise.all(
    Object.entries(registry.items).map(async ([id, digest]) => {
      const value = await registry.load(normalizeItem(id), digest);
      const targets = new Set<string>();

      for (const { target } of value.item.files ?? []) {
        if (
          targets.has(target) ||
          !/^(?:@(?:ui|components|hooks|lib)|~)\//u.test(target) ||
          /(?:^|\/)\.\.(?:\/|$)|\\/u.test(target)
        ) {
          throw new Error(`Invalid or duplicate target ${target} in ${id}.`);
        }

        targets.add(target);
      }

      return value;
    }),
  );

  const dependencies = new Map(items.map(({ id, item }) => [id, item.registryDependencies ?? []]));
  const visited = new Set<string>();
  const active = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) {
      return;
    }

    if (active.has(id)) {
      throw new Error(`Registry dependency cycle at ${id}.`);
    }

    const children = dependencies.get(id);

    if (children === undefined) {
      throw new Error(`Missing registry dependency ${id}.`);
    }

    active.add(id);

    for (const child of children) {
      visit(normalizeItem(child));
    }

    active.delete(id);
    visited.add(id);
  };

  for (const id of dependencies.keys()) {
    visit(id);
  }

  return items.length;
};

export const buildRegistry = async (cwd: string, input: string, examples: string, out: string) => {
  const output = path.resolve(cwd, out);
  const sources: RegistrySource[] = [["erbium", path.resolve(cwd, input)]];

  if (examples.length > 0) {
    sources.push(["erbium-examples", path.resolve(cwd, examples)]);
  }

  const managed = path.join(output, "r", "erbium");
  await publishRevisions(managed, false, sources);
  const count = await validateRegistry(cwd, managed);

  await Promise.all(
    sources.map(async ([namespace, file]) => {
      const target = path.join(output, "r", namespace === "erbium" ? "ui" : "examples");
      const text = await readFile(file, "utf-8");
      const { items } = decodeCatalog(parseJson(text));
      await mkdir(target, { recursive: true });
      await Promise.all(
        items.map(async (item) => {
          const { name } = itemName(item);
          const id = normalizeItem(`@${namespace}/${name}`);
          snapshotFor(id, item);
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

  return { output, count };
};

const routes =
  /^\/(?<file>r\/(?:erbium\/(?:index\.json|history\.json|revisions\/[a-f0-9]{64}\.json)|(?:ui|examples)\/[a-z0-9-]+\.json))$/u;

export const serveRegistry = async (root: string, port: number, signal: AbortSignal) => {
  const server = createServer((request, response) => {
    const [url = ""] = request.url?.split("?") ?? [];
    const file = routes.exec(url)?.groups?.file;

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

      response
        .writeHead(200, { "Content-Type": "application/json" })
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
