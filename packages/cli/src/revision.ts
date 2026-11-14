import { createHash } from "node:crypto";
import * as Schema from "effect/Schema";

const rev = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/u));

const file = Schema.Struct({
  content: Schema.String,
  path: Schema.String,
  target: Schema.String,
  type: Schema.String,
});

const payload = Schema.Struct({
  dependencies: Schema.optionalKey(Schema.Array(Schema.String)),
  devDependencies: Schema.optionalKey(Schema.Array(Schema.String)),
  files: Schema.optionalKey(Schema.Array(file)),
  name: Schema.String,
  registryDependencies: Schema.optionalKey(Schema.Array(Schema.String)),
  type: Schema.String,
});

export const manifest = Schema.Struct({
  version: Schema.Literal(1),
  items: Schema.Record(Schema.String, rev),
});

export const snapshot = Schema.Struct({ id: Schema.String, item: payload });

export type Snapshot = typeof snapshot.Type;

export const hash = (content: string): string => createHash("sha256").update(content).digest("hex");

export const revision = (value: Snapshot): string =>
  hash(JSON.stringify({ id: value.id, item: Schema.decodeUnknownSync(payload)(value.item) }));

const payloadKeys = new Set([
  "$schema",
  "author",
  "categories",
  "description",
  "docs",
  "meta",
  "title",
  ...Object.keys(payload.fields),
]);

export const snapshotFor = (id: string, input: Readonly<Record<string, Schema.Json>>): Snapshot => {
  const unsupported = Object.keys(input).filter((key) => !payloadKeys.has(key));

  if (unsupported.length > 0) {
    throw new Error(`Unsupported install fields in ${id}: ${unsupported.join(", ")}`);
  }

  return { id, item: Schema.decodeUnknownSync(payload)(input) };
};

export const parseJson = Schema.decodeUnknownSync(Schema.fromJsonString(Schema.Json));
