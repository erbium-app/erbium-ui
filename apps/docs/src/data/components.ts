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

export const components = manifest.map((entry) => {
  const item = (registry.items as ComponentEntry[]).find((item) => item.name === entry.name) ?? {
    name: entry.name,
    title: entry.title,
    description: "",
  };
  const page = pages[`../components/${item.name}/index.md`];
  if (!page) throw new Error(`Missing documentation for ${item.name}`);
  return {
    ...item,
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    href: documentationHref(item.name),
    kind: item.name.startsWith("use-") ? "hook" : "component",
  };
});

function documentationHref(name: string) {
  return `/docs/${name.startsWith("use-") ? "hooks" : "components"}/${name}`;
}

export const navigationGroups = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Components",
    href: "/docs/components",
    items: components
      .filter((item) => item.kind === "component")
      .sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    title: "Hooks",
    href: "/docs/hooks",
    items: components
      .filter((item) => item.kind === "hook")
      .sort((a, b) => a.title.localeCompare(b.title)),
  },
];
