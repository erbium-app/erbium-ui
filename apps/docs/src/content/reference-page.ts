import { componentReference } from "@erbium/content/markdown";
import { componentDocuments, variantDocuments } from "@erbium/content/documents";
import manifest from "@erbium/showcase/manifest";
import { showcaseSource } from "@erbium/showcase/sources";
import showcaseRegistry from "@erbium/showcase/registry";
import { documentationSections } from "@/content/sections";
import { components } from "@/content/catalog";

export function referencePage(name: string) {
  const component = components.find((item) => item.name === name);
  if (!component) throw new Error(`Missing reference page: ${name}`);
  const reference = componentReference(name);
  const pages = componentDocuments as Record<
    string,
    import("astro").MarkdownInstance<Record<string, string>>
  >;
  const descriptions = variantDocuments as typeof pages;
  const page = pages[`../components/${name}/index.md`];
  if (!page) throw new Error(`Missing Markdown documentation: ${name}`);
  const { Content, frontmatter } = page;
  const repeatedSummary =
    page
      .rawContent()
      .replace(/^---[\s\S]*?---/, "")
      .trim()
      .split(/\n\s*\n/)[0] === frontmatter.description;
  const catalog = manifest.find((entry) => entry.name === name)!;
  const variants = catalog.variants.map((variant) => ({
    ...variant,
    Content: descriptions[`../components/${name}/${variant.slug}.md`].Content,
    source: showcaseSource(variant.source),
    files:
      showcaseRegistry.items
        .find((item) => item.name === `${name}-${variant.slug}`)
        ?.files?.map((file) => ({
          path: file.path,
          source: showcaseSource(file.path),
        })) ?? [],
  }));
  const lead = variants.find((item) => item.exportName === "Overview") ?? variants[0];
  const remaining = variants.filter((item) => item !== lead);
  const markdownHeadings = page
    .getHeadings()
    .filter((heading) => heading.depth === 2 || heading.depth === 3);
  const showcaseAnchor = (slug: string) =>
    markdownHeadings.some((heading) => heading.slug === slug) ? `example-${slug}` : slug;
  const headings = [
    { depth: 2, slug: showcaseAnchor(lead.slug), text: lead.title },
    ...markdownHeadings,
    ...remaining.map((variant) => ({
      depth: 2,
      slug: showcaseAnchor(variant.slug),
      text: variant.title,
    })),
    ...(reference ? [{ depth: 2, slug: "component-reference-title", text: reference.title }] : []),
  ];
  const section = documentationSections.find((section) => section.slug === component.sectionSlug)!;
  const neighbors = section.names.map((name) => components.find((item) => item.name === name)!);
  const index = neighbors.findIndex((item) => item.name === name);
  return {
    component,
    reference,
    Content,
    frontmatter,
    repeatedSummary,
    lead,
    remaining,
    headings,
    showcaseAnchor,
    neighbors,
    index,
  };
}
