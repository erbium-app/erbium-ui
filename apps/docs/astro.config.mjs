import { unified } from "@astrojs/markdown-remark";
import { rehypeHighlightCodeBlocks } from "@tanstack/highlight/rehype";
import { highlighter } from "./src/lib/highlight.ts";
import { rehypeCodeBlocks } from "./src/lib/rehype-code-blocks.ts";
import { rehypeExternalLinks } from "./src/lib/rehype-external-links.ts";
import { registryPlugin, registryIntegration } from "./registry-plugin.mjs";
import { showcaseVitePlugin, showcaseIntegration } from "./showcase-vite-plugin.mjs";
import { documentationSections, kindPaths } from "./src/data/documentation-sections.ts";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://ui.erbium.app",
  output: "static",
  build: {
    // Keep first-paint styles in the HTML instead of a blocking CSS request.
    inlineStylesheets: "always",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Cal Sans",
      cssVariable: "--font-docs-sans",
      fallbacks: ["Arial", "sans-serif"],
      options: {
        variants: [
          { src: ["./src/assets/fonts/CalSansVF.woff2"], weight: "400 700", style: "normal" },
          {
            src: ["./src/assets/fonts/CalSansVF-Italic.woff2"],
            weight: "400 700",
            style: "italic",
          },
        ],
      },
    },
  ],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      rehypePlugins: [
        [rehypeHighlightCodeBlocks, { highlighter }],
        rehypeCodeBlocks,
        rehypeExternalLinks,
      ],
    }),
  },
  trailingSlash: "never",
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  redirects: {
    "/docs/foundations/styles": "/docs/installation",
    "/docs/components/styles": "/docs/installation",
    ...Object.fromEntries(
      documentationSections
        .filter((section) => section.kind !== "component")
        .flatMap((section) =>
          section.names.map((name) => [
            `/docs/components/${name}`,
            `/docs/${kindPaths[section.kind]}/${name}`,
          ]),
        ),
    ),
  },
  integrations: [react(), registryIntegration(), showcaseIntegration()],
  vite: {
    // Lightning CSS folds scroll timelines into animation shorthand, which
    // browsers reject. Keep shadcn's scroll-fade declarations separate.
    build: { cssMinify: "esbuild" },
    plugins: [tailwindcss({ optimize: { minify: false } }), registryPlugin(), showcaseVitePlugin()],
  },
});
