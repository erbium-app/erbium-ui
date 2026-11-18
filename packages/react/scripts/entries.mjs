import { readFile } from "node:fs/promises";
import path from "node:path";

/*
 * Reads entries.json: the package's entry points, split into client entries (React components,
 * marked "use client" in the build) and server entries (pure functions any runtime can call).
 */

const packageRoot = path.dirname(import.meta.dirname);

/**
 * @param {unknown} value - A parsed JSON value.
 * @param {string} key - A property name.
 * @returns {string[]} The strings in the array at that property.
 */
const stringsAt = (value, key) => {
  if (!(value instanceof Object)) {
    throw new TypeError(`entries.json must be an object with a "${key}" list.`);
  }

  /** @type {[string, unknown][]} */
  const fields = Object.entries(value);
  const field = fields.find(([name]) => name === key)?.[1];

  if (!Array.isArray(field)) {
    throw new TypeError(`entries.json "${key}" must be a list of entry paths.`);
  }

  /** @type {unknown[]} */
  const items = field;

  return items.map((item) => {
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- this is the I/O boundary: it parses entries.json into a list of strings.
    if (typeof item !== "string") {
      throw new TypeError(`entries.json "${key}" must hold only strings.`);
    }

    return item;
  });
};

/** @type {unknown} */
const parsed = JSON.parse(await readFile(path.join(packageRoot, "entries.json"), "utf-8"));

const clientEntries = stringsAt(parsed, "client");
const serverEntries = stringsAt(parsed, "server");

export { clientEntries, packageRoot, serverEntries };
