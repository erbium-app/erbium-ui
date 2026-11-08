import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import type { Plugin } from "vite-plus";
import { documentationSections, kindPaths } from "@erbium/content/taxonomy";
import registry from "../../packages/ui/registry.json" with { type: "json" };

const root = new URL("../../packages/", import.meta.url);

export const navigationMetadata = () =>
  documentationSections.flatMap((section) =>
    section.names.map((name) => {
      const { data } = matter(
        readFileSync(new URL(`content/components/${name}/index.md`, root), "utf-8"),
      );

      return {
        description: String(data.description),
        files:
          registry.items.find((item) => item.name === name)?.files?.map(({ path }) => ({ path })) ??
          [],
        href: `/docs/${kindPaths[section.kind]}/${name}`,
        kind: section.kind,
        name,
        section: section.title,
        title: String(data.title),
      };
    }),
  );

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
    hotUpdate({ file }) {
      const module = file.includes("packages/content/")
        ? this.environment.moduleGraph.getModuleById("\0virtual:docs-navigation")
        : undefined;

      if (module) {
        this.environment.moduleGraph.invalidateModule(module);
      }

      return module ? [module] : undefined;
    },
    load: {
      filter: { id: /^\0virtual:docs-navigation$/u },
      handler: () => `export default ${JSON.stringify(navigationMetadata())};`,
    },
    name: "erbium:start-content",
    resolveId: {
      filter: { id: /^virtual:docs-navigation$/u },
      handler: () => "\0virtual:docs-navigation",
    },
  };
};
