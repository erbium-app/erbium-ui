import { readFile } from "node:fs/promises";
import path from "node:path";
import * as Schema from "effect/Schema";
import { manifest, parseJson, revision, snapshot, snapshotFor } from "./revision.ts";
import type { Snapshot } from "./revision.ts";

export const defaultRegistry = "https://ui.erbium.app/r/erbium";
const itemId = /^@(?:erbium|erbium-examples)\/[a-z0-9][a-z0-9-]*$/u;

export const normalizeItem = (value: string): string => {
  const id = value.includes("/") ? value : `@erbium/${value}`;

  if (!itemId.test(id)) {
    throw new Error(`Unsupported Erbium registry item: ${value}`);
  }

  return id;
};

const readRegistry = async (root: string, location: string, file: string): Promise<Schema.Json> => {
  if (!/^https?:\/\//u.test(location)) {
    return parseJson(await readFile(path.resolve(root, location, file), "utf-8"));
  }

  const response = await fetch(`${location.replace(/\/+$/u, "")}/${file}`, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Registry returned HTTP ${response.status} for ${file}.`);
  }

  return parseJson(await response.text());
};

export const openRegistry = async (root: string, location: string) => {
  const { items } = Schema.decodeUnknownSync(manifest)(
    await readRegistry(root, location, "index.json"),
  );

  return {
    items,
    async load(id: string, digest: string): Promise<Snapshot> {
      const raw = await readRegistry(root, location, `revisions/${digest}.json`);
      const decoded = Schema.decodeUnknownSync(snapshot)(raw);
      const value = snapshotFor(decoded.id, decoded.item);

      if (value.id !== id || value.item.name !== id.split("/")[1] || revision(value) !== digest) {
        throw new Error(`Invalid revision for ${id}: ${digest}`);
      }

      return value;
    },
  };
};
