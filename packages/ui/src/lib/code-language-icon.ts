import type { IconName } from "@erbium/icons";
import { normalizeCodeLanguage } from "./code-highlighter";

const languageIcons: Record<string, IconName> = {
  astro: "astro",
  c: "lang-c",
  cpp: "lang-c",
  css: "lang-css-duo",
  go: "lang-go",
  graphql: "graphql",
  html: "lang-html-duo",
  js: "lang-javascript-duo",
  json: "braces",
  jsonc: "braces",
  jsx: "react",
  markdown: "lang-markdown",
  mdx: "lang-markdown",
  plain: "file-text-duo",
  plaintext: "file-text-duo",
  python: "lang-python",
  ruby: "lang-ruby",
  rust: "lang-rust",
  sass: "sass",
  scss: "sass",
  shell: "bash-duo",
  sql: "file-table-duo",
  svelte: "svelte",
  swift: "lang-swift",
  text: "file-text-duo",
  ts: "lang-typescript-duo",
  tsx: "react",
  txt: "file-text-duo",
  vue: "vue",
  yaml: "yml",
  zsh: "bash-duo",
};

export function codeLanguageIcon(language?: string): IconName {
  return languageIcons[normalizeCodeLanguage(language ?? "text")] ?? "file-duo";
}
