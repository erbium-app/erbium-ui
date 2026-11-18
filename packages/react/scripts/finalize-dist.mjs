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

/**
 * @param {string} entry - A server entry path.
 * @returns {Promise<void>}
 */
const checkServer = async (entry) => {
  const code = await read(path.join(dist, `${entry}.js`));

  if (directivePattern.test(code)) {
    throw new Error(`Server entry ${entry} must not start with "use client".`);
  }
};

await Promise.all([
  ...clientEntries.map(markClient),
  ...serverEntries.map(checkServer),
  ...[...clientEntries, ...serverEntries].map(
    async (entry) => await read(path.join(dist, `${entry}.d.ts`)),
  ),
]);
