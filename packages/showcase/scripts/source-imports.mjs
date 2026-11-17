import { stat } from "node:fs/promises";
import path from "node:path";

const importSpecifier = /(?:from\s*|import\s*(?:\(\s*)?)["'](?<specifier>[^"']+)["']/gu;
const localSuffixes = ["", ".tsx", ".ts", ".json", "/index.tsx", "/index.ts"];

/**
 * @param {string} source - Module source text.
 * @returns {string[]} The static and dynamic import specifiers, in source order.
 */
export const imports = (source) =>
  [...source.matchAll(importSpecifier)].flatMap((match) => match.groups?.specifier ?? []);

/**
 * Resolves a relative import the way the bundler does.
 * @param {string} specifier - The relative import specifier.
 * @param {string} from - The importing file.
 * @returns {Promise<string>} The first existing candidate by suffix order.
 */
export const localImport = async (specifier, from) => {
  const [request = ""] = specifier.split("?");
  const base = path.resolve(path.dirname(from), request);
  const candidates = localSuffixes.map((suffix) => base + suffix);

  const found = await Promise.all(
    candidates.map(async (candidate) => {
      const info = await stat(candidate, { throwIfNoEntry: false });

      return info?.isFile() === true;
    }),
  );

  const match = candidates.find((_candidate, index) => found[index]);

  if (match === undefined) {
    throw new Error(`Unresolved showcase dependency ${specifier} in ${from}`);
  }

  return match;
};
