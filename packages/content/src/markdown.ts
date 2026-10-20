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

export const componentReferences = (name: string) =>
  references[`../references/${name}.md`]?.trim() ?? "";

export const componentReference = (name: string) => {
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
};

export const componentReferenceLinks = (name: string) => componentReference(name)?.links ?? [];

const pages = import.meta.glob<string>("../*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const body = (markdown: string | undefined, name: string) => {
  if (!markdown) {
    throw new Error(`Missing documentation: ${name}`);
  }

  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
};

export const componentDocumentation = (name: string) =>
  [body(components[`../components/${name}/index.md`], name), componentReferences(name)]
    .filter(Boolean)
    .join("\n\n");

export const pageDocumentation = (name: string) =>
  body(pages[`../${name}.md`], name).replace(/^# [^\r\n]+\r?\n\s*/, "");

export const variantDocumentation = (name: string, variant: string) => {
  const markdown = components[`../components/${name}/${variant}.md`];

  if (markdown === undefined) {
    throw new Error(`Missing variant documentation: ${name}/${variant}`);
  }

  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
};
