/// <reference types="vite/client" />

const components = import.meta.glob<string>("../components/*/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const references = import.meta.glob<string>("../references/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export function componentReferences(name: string) {
  return references[`../references/${name}.md`]?.trim() ?? "";
}

export function componentReference(name: string) {
  const markdown = componentReferences(name);

  if (!markdown) {
    return;
  }

  const [heading, description] = markdown.split(/\n\s*\n/);

  const links = [...markdown.matchAll(/^- \[([^\]]+)\]\((https:\/\/[^)]+)\)$/gm)].map((match) => ({
    href: match[2],
    title: match[1],
  }));

  return { description, links, title: heading.replace(/^## /, "") };
}

export function componentReferenceLinks(name: string) {
  return componentReference(name)?.links ?? [];
}

const pages = import.meta.glob<string>("../*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

function body(markdown: string | undefined, name: string) {
  if (!markdown) {
    throw new Error(`Missing documentation: ${name}`);
  }

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

  if (markdown === undefined) {
    throw new Error(`Missing variant documentation: ${name}/${variant}`);
  }

  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}
