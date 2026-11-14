import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import type { Plugin } from "vite-plus";
import { documentationSections, kindPaths } from "@erbium/content/taxonomy";
import registry from "../../packages/ui/registry.json" with { type: "json" };

const root = new URL("../../packages/", import.meta.url);

const frontmatter = (file: string) => {
  const { data } = matter(readFileSync(new URL(`content/${file}.md`, root), "utf-8"));

  return { description: String(data.description), title: String(data.title) };
};

// Guides live at fixed routes; titles and descriptions come from their frontmatter.
const guideRoutes = [
  { file: "introduction", href: "/", section: "Overview" },
  { file: "roadmap", href: "/docs/roadmap", section: "Overview" },
  { file: "installation", href: "/docs/installation", section: "Guides" },
  { file: "getting-started", href: "/docs/getting-started", section: "Guides" },
  {
    example: { name: "marker", slug: "shimmer" },
    file: "shimmer",
    href: "/docs/utilities/shimmer",
    section: "Utilities",
  },
];

/** Every documentation page. Vite config prerenders these; `virtual:docs-catalog` serves them. */
export const docsCatalog = () => ({
  components: documentationSections.flatMap((section) =>
    section.names.map((name) => ({
      ...frontmatter(`components/${name}/index`),
      files:
        registry.items.find((item) => item.name === name)?.files?.map(({ path }) => ({ path })) ??
        [],
      href: `/docs/${kindPaths[section.kind]}/${name}`,
      kind: section.kind,
      name,
      section: section.title,
    })),
  ),
  guides: guideRoutes.map((guide) => ({ ...guide, ...frontmatter(guide.file) })),
});

const virtualId = "virtual:docs-catalog";
const resolvedId = `\0${virtualId}`;

export const contentPlugin = (): Plugin => {
  const light = ["theme", "surfaces"]
    .map((name) => {
      const source = readFileSync(new URL(`ui/src/styles/${name}.css`, root), "utf-8");
      const start = source.indexOf(":root {");

      return source
        .slice(start, source.indexOf("\n}", start) + 2)
        .replace(":root", ".showcase-content.light");
    })
    .join("\n");

  const cache = new URL(".cache/", import.meta.url);
  mkdirSync(cache, { recursive: true });
  writeFileSync(new URL("theme.css", cache), light);

  return {
    load: {
      filter: { id: /^\0virtual:docs-catalog$/u },
      handler() {
        const { components, guides } = docsCatalog();

        // The catalog reads these files directly; watching them puts them in the module
        // graph, so an edit invalidates the catalog like any other import.
        for (const file of [
          ...components.map((component) => `content/components/${component.name}/index.md`),
          ...guides.map((guide) => `content/${guide.file}.md`),
          "ui/registry.json",
        ]) {
          this.addWatchFile(fileURLToPath(new URL(file, root)));
        }

        return `export const components = ${JSON.stringify(components)};\nexport const guides = ${JSON.stringify(guides)};`;
      },
    },
    name: "erbium:start-content",
    resolveId: {
      filter: { id: /^virtual:docs-catalog$/u },
      handler: () => resolvedId,
    },
  };
};
