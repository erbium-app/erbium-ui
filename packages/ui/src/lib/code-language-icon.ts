import type { IconName } from "@erbium/icons";

// Each icon with the language names and aliases it covers.
const icons: [IconName, string[]][] = [
  ["astro", ["astro"]],
  ["bash-duo", ["ansi", "bash", "sh", "shell", "shellscript", "zsh"]],
  ["braces", ["json", "jsonc"]],
  ["file-table-duo", ["sql"]],
  ["file-text-duo", ["plain", "plaintext", "text", "txt"]],
  ["git", ["diff", "patch"]],
  ["graphql", ["graphql"]],
  ["lang-c", ["c", "cpp"]],
  ["lang-css-duo", ["css"]],
  ["lang-go", ["go"]],
  ["lang-html-duo", ["html"]],
  ["lang-javascript-duo", ["javascript", "js"]],
  ["lang-markdown", ["markdown", "md", "mdx"]],
  ["lang-python", ["py", "python"]],
  ["lang-ruby", ["ruby"]],
  ["lang-rust", ["rust"]],
  ["lang-swift", ["swift"]],
  ["lang-typescript-duo", ["ts", "typescript"]],
  ["react", ["jsx", "tsx"]],
  ["sass", ["sass", "scss"]],
  ["svelte", ["svelte"]],
  ["vue", ["vue"]],
  ["yml", ["yaml", "yml"]],
];

const languageIcons = new Map(
  icons.flatMap(([icon, languages]) => languages.map((language) => [language, icon] as const)),
);

export const codeLanguageIcon = (language = "text"): IconName =>
  languageIcons.get(language.trim().toLowerCase()) ?? "file-duo";
