import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

// Start's prerender preview must use the same output directory and platform
// configuration as the build. Otherwise stale HTML can reference missing assets.
const output = path.resolve(import.meta.dirname, process.argv[2] ?? "dist/client");
const files = await readdir(output, { recursive: true });
const pages = files.filter((file) => file.endsWith(".html"));

if (!pages.includes("index.html")) {
  throw new Error(`Missing prerendered home page in ${output}`);
}

const references = await Promise.all(
  pages.map(async (file) => {
    const html = await readFile(path.join(output, file), "utf-8");

    const assets = [
      ...html.matchAll(/(?:src|href)="(?<asset>\/assets\/[^"?#]+)(?:[?#][^"]*)?"/gu),
    ].flatMap((match) => (match.groups?.asset === undefined ? [] : [match.groups.asset]));

    if (assets.length === 0) {
      throw new Error(`No application assets in ${file}`);
    }

    return assets;
  }),
);

const assets = new Set(references.flat());

await Promise.all(
  [...assets].map(async (asset) => {
    await access(path.join(output, decodeURIComponent(asset)));
  }),
);

process.stdout.write(
  `Verified ${pages.length} prerendered pages and ${assets.size} referenced assets.\n`,
);
