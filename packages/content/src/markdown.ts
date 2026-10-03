/// <reference types="vite/client" />

const components = import.meta.glob<string>("../components/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const pages = import.meta.glob<string>("../*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function body(markdown: string | undefined, name: string) {
  if (!markdown) throw new Error(`Missing documentation: ${name}`);
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}

export function componentDocumentation(name: string) {
  return body(components[`../components/${name}/index.md`], name);
}

export function pageDocumentation(name: string) {
  return body(pages[`../${name}.md`], name).replace(/^# [^\r\n]+\r?\n\s*/, "");
}

export function variantDocumentation(name: string, variant: string) {
  const markdown = components[`../components/${name}/${variant}.md`];
  if (markdown === undefined) throw new Error(`Missing variant documentation: ${name}/${variant}`);
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}
