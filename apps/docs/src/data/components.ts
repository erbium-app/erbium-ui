import { documentationSections, kindPaths } from "./documentation-sections";
import { componentDocuments } from "@erbium/content/documents";
import manifest from "@erbium/showcase/manifest";
import registry from "../../../../packages/ui/registry.json";

type ComponentEntry = {
  name: string;
  title: string;
  description: string;
  files?: Array<{ path: string }>;
};

const pages = componentDocuments as Record<
  string,
  import("astro").MarkdownInstance<{ title: string; description: string }>
>;

export const components = [...manifest, { name: "colors", title: "Colors", variants: [] }].map(
  (entry) => {
    const item = (registry.items as ComponentEntry[]).find((item) => item.name === entry.name) ?? {
      name: entry.name,
      title: entry.title,
      description: "",
    };
    const section = documentationSections.find((section) => section.names.includes(item.name));
    if (!section) throw new Error(`Missing navigation classification for ${item.name}`);
    const page = pages[`../components/${item.name}/index.md`];
    if (!page) throw new Error(`Missing documentation for ${item.name}`);
    return {
      ...item,
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      href: `/docs/${kindPaths[section.kind]}/${item.name}`,
      kind: section.kind,
      section: section.title,
      sectionSlug: section.slug,
    };
  },
);

export const navigationGroups = [
  {
    title: "Getting started",
    href: undefined,
    items: [
      { title: "Introduction", href: "/" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Getting started", href: "/docs/getting-started" },
      { title: "Roadmap", href: "/docs/roadmap" },
    ],
  },
  ...documentationSections.map((section) => ({
    title: section.title,
    href: section.kind === "component" ? undefined : `/docs/${kindPaths[section.kind]}`,
    items: [
      ...section.names.map((name) => components.find((item) => item.name === name)!),
      ...(section.kind === "utility" ? [{ title: "Shimmer", href: "/docs/shimmer" }] : []),
    ],
  })),
];
