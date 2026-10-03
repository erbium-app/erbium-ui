/// <reference types="vite/client" />

const components = import.meta.glob<string>("../components/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const references = import.meta.glob<string>("../references/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function componentReferences(name: string) {
  return references[`../references/${name}.md`]?.trim() ?? "";
}
export function componentReference(name: string) {
  const markdown = componentReferences(name);
  if (!markdown) return undefined;
  const [heading, description] = markdown.split(/\n\s*\n/);
  const links = [...markdown.matchAll(/^- \[([^\]]+)\]\((https:\/\/[^)]+)\)$/gm)].map((match) => ({
    title: match[1],
    href: match[2],
  }));
  return { title: heading.replace(/^## /, ""), description, links };
}
export function componentReferenceLinks(name: string) {
  return componentReference(name)?.links ?? [];
}
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
  return [body(components[`../components/${name}/index.md`], name), componentReferences(name)]
    .filter(Boolean)
    .join("\n\n");
}

export function pageDocumentation(name: string) {
  return body(pages[`../${name}.md`], name).replace(/^# [^\r\n]+\r?\n\s*/, "");
}

export function variantDocumentation(name: string, variant: string) {
  const markdown = components[`../components/${name}/${variant}.md`];
  if (markdown === undefined) throw new Error(`Missing variant documentation: ${name}/${variant}`);
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}
