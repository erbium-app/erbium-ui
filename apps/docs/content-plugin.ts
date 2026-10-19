import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import type { Plugin } from "vite-plus";
import type { DocumentationKind } from "@erbium/content/taxonomy";

const root = new URL("../../packages/", import.meta.url);

const sections: { title: string; kind: DocumentationKind; names: string[] }[] = JSON.parse(
  readFileSync(new URL("content/src/sections.json", root), "utf-8"),
);

const paths: Record<DocumentationKind, string> = {
  block: "blocks",
  component: "components",
  foundation: "foundations",
  hook: "hooks",
  provider: "providers",
  utility: "utilities",
};

const registry: { items: { name: string; files?: { path: string }[] }[] } = JSON.parse(
  readFileSync(new URL("ui/registry.json", root), "utf-8"),
);

export function navigationMetadata() {
  return sections.flatMap((section) =>
    section.names.map((name) => {
      const { data } = matter(
        readFileSync(new URL(`content/components/${name}/index.md`, root), "utf-8"),
      );

      return {
        description: String(data.description),
        files:
          registry.items.find((item) => item.name === name)?.files?.map(({ path }) => ({ path })) ??
          [],
        href: `/docs/${paths[section.kind]}/${name}`,
        kind: section.kind,
        name,
        section: section.title,
        title: String(data.title),
      };
    }),
  );
}

export function contentPlugin(): Plugin {
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
    handleHotUpdate(context) {
      if (context.file.includes("packages/content/")) {
        const module = context.server.moduleGraph.getModuleById("\0virtual:docs-navigation");

        if (module) {
          context.server.moduleGraph.invalidateModule(module);

          return [module];
        }
      }
    },
    load(id) {
      if (id === "\0virtual:docs-navigation") {
        return `export default ${JSON.stringify(navigationMetadata())};`;
      }
    },
    name: "erbium:start-content",
    resolveId(id) {
      if (id === "virtual:docs-navigation") {
        return "\0virtual:docs-navigation";
      }
    },
  };
}
