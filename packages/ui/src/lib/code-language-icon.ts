import type { IconName } from "@erbium/icons";
import { normalizeCodeLanguage } from "./code-highlighter";

const languageIcons = new Map<string, IconName>([
  ["ansi", "bash-duo"],
  ["astro", "astro"],
  ["c", "lang-c"],
  ["cpp", "lang-c"],
  ["css", "lang-css-duo"],
  ["diff", "git"],
  ["go", "lang-go"],
  ["graphql", "graphql"],
  ["html", "lang-html-duo"],
  ["js", "lang-javascript-duo"],
  ["json", "braces"],
  ["jsonc", "braces"],
  ["jsx", "react"],
  ["markdown", "lang-markdown"],
  ["mdx", "lang-markdown"],
  ["plain", "file-text-duo"],
  ["plaintext", "file-text-duo"],
  ["python", "lang-python"],
  ["ruby", "lang-ruby"],
  ["rust", "lang-rust"],
  ["sass", "sass"],
  ["scss", "sass"],
  ["shell", "bash-duo"],
  ["sql", "file-table-duo"],
  ["svelte", "svelte"],
  ["swift", "lang-swift"],
  ["text", "file-text-duo"],
  ["ts", "lang-typescript-duo"],
  ["tsx", "react"],
  ["txt", "file-text-duo"],
  ["vue", "vue"],
  ["yaml", "yml"],
  ["zsh", "bash-duo"],
]);

export const codeLanguageIcon = (language?: string): IconName =>
  languageIcons.get(normalizeCodeLanguage(language ?? "text")) ?? "file-duo";
