import { unified } from "@astrojs/markdown-remark";
import { rehypeHighlightCodeBlocks } from "@tanstack/highlight/rehype";
import { highlighter } from "./src/lib/highlight.ts";
import { rehypeExternalLinks } from "./src/lib/rehype-external-links.ts";
import { registryPlugin, registryIntegration } from "./registry-plugin.mjs";
import { showcaseVitePlugin, showcaseIntegration } from "./showcase-vite-plugin.mjs";
import { documentationSections, kindPaths } from "./src/data/documentation-sections.ts";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ui.erbium.app",
  output: "static",
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      rehypePlugins: [[rehypeHighlightCodeBlocks, { highlighter }], rehypeExternalLinks],
    }),
  },
  trailingSlash: "never",
  redirects: Object.fromEntries(
    documentationSections
      .filter((section) => section.kind !== "component")
      .flatMap((section) =>
        section.names.map((name) => [
          `/docs/components/${name}`,
          `/docs/${kindPaths[section.kind]}/${name}`,
        ]),
      ),
  ),
  integrations: [react(), registryIntegration(), showcaseIntegration()],
  vite: {
    plugins: [tailwindcss(), registryPlugin(), showcaseVitePlugin()],
  },
});
