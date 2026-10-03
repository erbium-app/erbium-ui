import { createHighlighter, renderNodesToHtml, renderTokens } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { html } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { yaml } from "@tanstack/highlight/languages/yaml";

export const highlighter = createHighlighter({
  languages: [css, html, js, json, jsx, shell, ts, tsx, yaml],
});

// The shell owns pre/code and copy targets. Core rendering preserves exact source,
// including trailing whitespace; Markdown fences use the separate rehype adapter.
export function highlightSource(source: string, path: string) {
  const lang = path.split(".").at(-1);
  const { tokens } = highlighter.tokenize(source, { lang });
  return renderNodesToHtml(renderTokens(tokens));
}
