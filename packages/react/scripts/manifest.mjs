import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { packageRoot } from "./entries.mjs";

/*
 * Inside the monorepo, `exports` point at the TypeScript source, so apps and packages/ui use the
 * primitives without a build step. The published package points at `dist`. `publish` (run by
 * prepack) swaps in `publishConfig.exports` and keeps the original manifest beside it;
 * `restore` (run by postpack) puts the original back.
 */

const manifest = path.join(packageRoot, "package.json");
const backup = path.join(packageRoot, "package.json.bak");

/**
 * @param {unknown} value - A parsed JSON value.
 * @returns {Record<string, unknown>} The value as an object.
 */
const asObject = (value) => {
  if (!(value instanceof Object) || Array.isArray(value)) {
    throw new TypeError("package.json must hold a publishConfig object.");
  }

  return Object.fromEntries(Object.entries(value));
};

const mode = process.argv.at(2);

if (mode === "publish") {
  const text = await readFile(manifest, "utf-8");
  /** @type {unknown} */
  const parsed = JSON.parse(text);
  const json = asObject(parsed);
  const { exports, ...publishConfig } = asObject(json.publishConfig);

  if (exports === undefined) {
    throw new Error("package.json has no publishConfig.exports to publish.");
  }

  await writeFile(backup, text);
  await writeFile(
    manifest,
    `${JSON.stringify({ ...json, exports, publishConfig }, undefined, 2)}\n`,
  );
} else if (mode === "restore") {
  await rename(backup, manifest);
} else {
  throw new Error("Usage: node scripts/manifest.mjs publish|restore");
}
