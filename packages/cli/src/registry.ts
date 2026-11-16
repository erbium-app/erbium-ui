import { readFile } from "node:fs/promises";
import path from "node:path";
import * as Schema from "effect/Schema";
import { registryRequest } from "./registry-config.ts";
import {
  manifest,
  parseJson,
  releaseHistory,
  revision,
  rev,
  snapshot,
  snapshotFor,
} from "./revision.ts";
import type { Snapshot } from "./revision.ts";

const itemId = /^@(?:erbium|erbium-examples)\/[a-z0-9][a-z0-9-]*$/u;

export const normalizeItem = (value: string): string => {
  const id = value.includes("/") ? value : `@erbium/${value}`;

  if (!itemId.test(id)) {
    throw new Error(`Unsupported Erbium registry item: ${value}`);
  }

  return id;
};

const readRegistry = async (
  { location, headers }: Awaited<ReturnType<typeof registryRequest>>,
  file: string,
): Promise<Schema.Json> => {
  if (!/^https?:\/\//u.test(location)) {
    return parseJson(await readFile(path.join(location, file), "utf-8"));
  }

  const endpoint = new URL(`${location}/${file}`);
  const options: RequestInit = { signal: AbortSignal.timeout(15_000) };

  if (headers !== undefined) {
    options.headers = headers;
    options.redirect = "error";
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`Registry returned HTTP ${response.status} for ${file}.`);
  }

  return parseJson(await response.text());
};

export const openRegistry = async (root: string, location: string) => {
  const request = await registryRequest(root, location);

  const { items, catalog = {} } = Schema.decodeUnknownSync(manifest)(
    await readRegistry(request, "index.json"),
  );

  return {
    items,
    catalog,
    async history() {
      const releases = Schema.decodeUnknownSync(releaseHistory)(
        await readRegistry(request, "history.json"),
      );

      const published = new Map<string, string>();

      return releases
        .toReversed()
        .map(({ commit, date, changes }) => {
          for (const [id, digest] of Object.entries(changes)) {
            if (digest === null) {
              published.delete(id);
            } else {
              published.set(id, digest);
            }
          }

          return { commit, date, items: Object.fromEntries(published) };
        })
        .toReversed();
    },
    async load(id: string, digest: string): Promise<Snapshot> {
      const checked = Schema.decodeUnknownSync(rev)(digest);
      const raw = await readRegistry(request, `revisions/${checked}.json`);
      const decoded = Schema.decodeUnknownSync(snapshot)(raw);
      const value = snapshotFor(decoded.id, decoded.item);

      if (value.id !== id || value.item.name !== id.split("/")[1] || revision(value) !== digest) {
        throw new Error(`Invalid revision for ${id}: ${digest}`);
      }

      return value;
    },
  };
};
