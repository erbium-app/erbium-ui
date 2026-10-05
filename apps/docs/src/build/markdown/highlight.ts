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
import Color from "colorjs.io";
import surfacesCss from "../../../../../packages/ui/src/styles/surfaces.css?raw";

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

// Match text contrast to the actual code background in each appearance.
function codeBackground(selector: string) {
  const block = surfacesCss.slice(surfacesCss.indexOf(`${selector} {`)).split("}")[0];
  const value = /--surface-canvas:\s*([^;]+);/.exec(block)?.[1];
  if (!value) throw new Error(`Missing code background for ${selector}`);
  return new Color(value).to("srgb");
}
const codeBackgrounds = [codeBackground(":root"), codeBackground(".dark")];
const black = new Color("oklch(0% 0 none)");
const white = new Color("oklch(100% 0 none)");

function colorText(value: string) {
  const color = new Color(value).to("srgb");
  color.toGamut();
  return codeBackgrounds.map((background) => {
    // CSS alpha compositing happens in sRGB; preserve the literal's opacity.
    const channel = (index: number) =>
      (color.coords[index] ?? 0) * color.alpha +
      (background.coords[index] ?? 0) * (1 - color.alpha);
    const rendered = new Color("srgb", [channel(0), channel(1), channel(2)]);
    return Color.contrastWCAG21(rendered, black) >= Color.contrastWCAG21(rendered, white)
      ? "oklch(0% 0 none)"
      : "oklch(100% 0 none)";
  });
}

// Decorate token boundaries without changing the CSS text copied by CodeBlock.
const colorLiteral = /oklch\([\d.%\s/+-]+(?:none[\d.%\s/+-]*)?\)/g;
export function highlightColorSource(source: string) {
  const colors = [...source.matchAll(colorLiteral)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    value: match[0],
    text: colorText(match[0]),
  }));
  const { tokens } = highlighter.tokenize(source, { lang: "css" });
  let offset = 0;
  const output: string[] = [];
  for (const token of tokens) {
    const end = offset + token.value.length;
    const boundaries = new Set([offset, end]);
    for (const color of colors) {
      if (color.start >= offset && color.start < end) boundaries.add(color.start);
      if (color.end > offset && color.end <= end) boundaries.add(color.end);
    }
    const points = [...boundaries].sort((a, b) => a - b);
    for (let index = 0; index < points.length - 1; index++) {
      const start = points[index];
      const finish = points[index + 1];
      const color = colors.find((entry) => entry.start === start);
      if (color)
        output.push(
          `<span class="code-color-value bg-(--code-color) text-(--code-color-text-light) rounded-xs dark:text-(--code-color-text-dark) [&_span]:text-inherit" style="--code-color:${color.value};--code-color-text-light:${color.text[0]};--code-color-text-dark:${color.text[1]}">`,
        );
      output.push(
        renderNodesToHtml(
          renderTokens([{ ...token, value: token.value.slice(start - offset, finish - offset) }]),
        ),
      );
      if (colors.some((entry) => entry.end === finish)) output.push("</span>");
    }
    offset = end;
  }
  return output.join("");
}
