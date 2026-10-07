import type { IconName } from "@erbium/icons";
import { normalizeCodeLanguage } from "./code-highlighter";

const languageIcons: Record<string, IconName> = {
  ts: "lang-typescript-duo",
  js: "lang-javascript-duo",
  tsx: "react",
  jsx: "react",
  json: "braces",
  jsonc: "braces",
  css: "lang-css-duo",
  html: "lang-html-duo",
  shell: "bash-duo",
  zsh: "bash-duo",
  yaml: "yml",
  python: "lang-python",
  sql: "file-table-duo",
  markdown: "lang-markdown",
  mdx: "lang-markdown",
  text: "file-text-duo",
  plaintext: "file-text-duo",
  plain: "file-text-duo",
  txt: "file-text-duo",
  go: "lang-go",
  rust: "lang-rust",
  ruby: "lang-ruby",
  swift: "lang-swift",
  c: "lang-c",
  cpp: "lang-c",
  astro: "astro",
  vue: "vue",
  svelte: "svelte",
  graphql: "graphql",
  sass: "sass",
  scss: "sass",
};

export function codeLanguageIcon(language?: string): IconName {
  return languageIcons[normalizeCodeLanguage(language ?? "text")] ?? "file-duo";
}
