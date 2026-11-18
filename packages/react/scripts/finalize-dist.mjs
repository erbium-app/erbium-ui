import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { clientEntries, packageRoot, serverEntries } from "./entries.mjs";

/*
 * Marks client entries with "use client" and checks the build output.
 *
 * Bundlers drop module directives from source, so the directive is added to the built entry
 * files. React Server Components frameworks, such as the Next.js App Router, then treat each
 * client entry as a client boundary, and a server component can render its parts. Pure entries
 * stay unmarked so servers can call them.
 */

const dist = path.join(packageRoot, "dist");
const directive = '"use client";\n';
const directivePattern = /^\s*["']use client["'];?/u;

/**
 * @param {string} file - A build output file.
 * @returns {Promise<string>} Its text.
 */
const read = async (file) => {
  try {
    return await readFile(file, "utf-8");
  } catch (error) {
    throw new Error(`Missing build output ${path.relative(packageRoot, file)}`, { cause: error });
  }
};

/**
 * @param {string} entry - A client entry path.
 * @returns {Promise<void>}
 */
const markClient = async (entry) => {
  const file = path.join(dist, `${entry}.js`);
  const code = await read(file);

  if (!directivePattern.test(code)) {
    await writeFile(file, `${directive}${code}`);
  }
};

const importPattern = /\bfrom\s*["'](?<specifier>[^"']+)["']/gu;
const clientPackages = /^(?:react|react-dom|@base-ui\/)/u;

/**
 * Checks a server entry and every module it imports from the build: none may be a client module
 * or import React or Base UI, so a server can import the entry.
 *
 * @param {string} file - A built module.
 * @param {string} entry - The server entry it is reached from.
 * @param {Set<string>} seen - Modules already checked.
 * @returns {Promise<void>}
 */
const checkServerModule = async (file, entry, seen) => {
  if (seen.has(file)) {
    return;
  }

  seen.add(file);
  const code = await read(file);
  const name = path.relative(dist, file);

  if (directivePattern.test(code)) {
    throw new Error(`Server entry ${entry} reaches ${name}, which starts with "use client".`);
  }

  const relative = [];

  for (const match of code.matchAll(importPattern)) {
    const specifier = match.groups?.specifier ?? "";

    if (clientPackages.test(specifier)) {
      throw new Error(`Server entry ${entry} reaches ${name}, which imports ${specifier}.`);
    }

    if (specifier.startsWith(".")) {
      relative.push(path.join(path.dirname(file), specifier));
    }
  }

  await Promise.all(
    relative.map(async (next) => {
      await checkServerModule(next, entry, seen);
    }),
  );
};

/**
 * @param {string} entry - A server entry path.
 * @returns {Promise<void>}
 */
const checkServer = async (entry) => {
  await checkServerModule(path.join(dist, `${entry}.js`), entry, new Set());
};

await Promise.all([
  ...clientEntries.map(markClient),
  ...serverEntries.map(checkServer),
  ...[...clientEntries, ...serverEntries].map(
    async (entry) => await read(path.join(dist, `${entry}.d.ts`)),
  ),
]);
