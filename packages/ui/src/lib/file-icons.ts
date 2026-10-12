import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import { spriteSheets } from "@erbium/icons/sprite";

const byFileName: Record<string, IconName> = {
  ".gitattributes": "git",
  ".gitignore": "git",
  ".gitmodules": "git",
  ".npmrc": "npm-duo",
  "bun.lock": "bun",
  "bun.lockb": "bun",
  dockerfile: "docker",
  "package-lock.json": "npm-duo",
  "package.json": "npm-duo",
};
// Matched against the basename, so tool configs resolve to their tool.
const byFileNameContains: Record<string, IconName> = {
  ".eslintrc": "eslint",
  ".prettierrc": "prettier",
  "biome.json": "biome",
  "docker-compose": "docker",
  "eslint.config": "eslint",
  "next.config": "nextjs",
  "oxfmt.config": "oxc",
  "oxlint.config": "oxc",
  "prettier.config": "prettier",
  "tailwind.config": "tailwind",
  "vite.config": "vite",
  "webpack.config": "webpack",
};
const byFileExtension: Record<string, IconName> = {
  astro: "astro",
  avif: "image-duo",
  bash: "bash-duo",
  c: "lang-c",
  cc: "lang-c",
  cjs: "lang-javascript-duo",
  cpp: "lang-c",
  css: "lang-css-duo",
  csv: "file-table-duo",
  cts: "lang-typescript-duo",
  gif: "image-duo",
  go: "lang-go",
  gql: "graphql",
  graphql: "graphql",
  gz: "file-zip-duo",
  h: "lang-c",
  hpp: "lang-c",
  htm: "lang-html-duo",
  html: "lang-html-duo",
  ico: "image-duo",
  jpeg: "image-duo",
  jpg: "image-duo",
  js: "lang-javascript-duo",
  json: "braces",
  json5: "braces",
  jsonc: "braces",
  jsx: "react",
  md: "lang-markdown",
  mdx: "lang-markdown",
  mjs: "lang-javascript-duo",
  mts: "lang-typescript-duo",
  otf: "font",
  png: "image-duo",
  py: "lang-python",
  rb: "lang-ruby",
  rs: "lang-rust",
  sass: "sass",
  scss: "sass",
  sh: "bash-duo",
  sql: "file-table-duo",
  svelte: "svelte",
  svg: "svg-2",
  swift: "lang-swift",
  tar: "file-zip-duo",
  tf: "terraform",
  tsv: "file-table-duo",
  ts: "lang-typescript-duo",
  tsx: "react",
  ttf: "font",
  txt: "file-text-duo",
  vue: "vue",
  wasm: "wasm-duo",
  webp: "image-duo",
  woff: "font",
  woff2: "font",
  yaml: "yml",
  yml: "yml",
  zig: "zig",
  zip: "file-zip-duo",
  zsh: "bash-duo",
};
const fallback: IconName = "file-duo";

function extensionCandidates(fileName: string) {
  const segments = fileName.split(".");
  // `a.spec.ts` tries `spec.ts` and then `ts`; a leading dot is not an extension.
  return segments.slice(1).map((_, index) => segments.slice(index + 1).join("."));
}

/** The icon for a file path: exact name, then tool-config name, then extension. */
function fileIconName(path: string): IconName {
  const fileName = (path.split("/").at(-1) ?? path).toLowerCase();
  const exact = byFileName[fileName];
  if (exact) return exact;
  for (const [needle, icon] of Object.entries(byFileNameContains)) {
    if (fileName.includes(needle)) return icon;
  }
  for (const extension of extensionCandidates(fileName)) {
    const icon = byFileExtension[extension];
    if (icon) return icon;
  }
  return fallback;
}

// Pierre's tree renders icons through a sprite injected into its shadow root.
// Give it the file-type group plus the few interface glyphs its slots need, so
// the tree draws the same artwork as the rest of the system.
const treeInterfaceIcons = [
  "chevron-down",
  "lock",
  "more-horizontal",
] as const satisfies IconName[];
function symbolMarkup(sheet: string, name: IconName) {
  const match = new RegExp(
    `<symbol[^>]*\\sid="${iconDefinitions[name].id}"[\\s\\S]*?</symbol>`,
  ).exec(sheet);
  return match?.[0] ?? "";
}
const files = spriteSheets.files;
const treeSpriteSheet = `${files.slice(0, files.lastIndexOf("</svg>"))}${treeInterfaceIcons
  .map((name) => symbolMarkup(spriteSheets.ui, name))
  .join("\n")}\n</svg>\n`;

function treeIcon(name: IconName) {
  const { id, viewBox } = iconDefinitions[name];
  return { name: id, viewBox };
}
function treeIcons<Rules extends Record<string, IconName>>(rules: Rules) {
  return Object.fromEntries(Object.entries(rules).map(([key, name]) => [key, treeIcon(name)]));
}

const fileTreeIcons = {
  set: "none",
  colored: false,
  spriteSheet: treeSpriteSheet,
  remap: {
    "file-tree-icon-chevron": treeIcon("chevron-down"),
    "file-tree-icon-file": treeIcon(fallback),
    "file-tree-icon-lock": treeIcon("lock"),
    "file-tree-icon-ellipsis": treeIcon("more-horizontal"),
  },
  byFileName: treeIcons(byFileName),
  byFileNameContains: treeIcons(byFileNameContains),
  byFileExtension: treeIcons(byFileExtension),
} as const;

export { fileIconName, fileTreeIcons };
