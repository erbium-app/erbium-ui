import { unified } from "@astrojs/markdown-remark";
import { rehypeHighlightCodeBlocks } from "@tanstack/highlight/rehype";
import { highlighter } from "./src/lib/highlight.ts";
import { rehypeCodeBlocks } from "./src/lib/rehype-code-blocks.ts";
import { rehypeExternalLinks } from "./src/lib/rehype-external-links.ts";
import { registryPlugin, registryIntegration } from "./registry-plugin.mjs";
import { showcaseVitePlugin, showcaseIntegration } from "./showcase-vite-plugin.mjs";
import sitemap from "@astrojs/sitemap";
import { seoIntegration } from "./seo-integration.mjs";
import { site } from "./src/lib/site-config.ts";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site,
  output: "static",
  build: {
    // Keep first-paint styles in the HTML instead of a blocking CSS request.
    inlineStylesheets: "always",
  },
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
  // Warm internal destinations on hover/focus, including prose and search links.
  // Astro falls back to tap when data saver or a slow connection is detected.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    react(),
    registryIntegration(),
    showcaseIntegration(),
    sitemap({
      filter: (url) => {
        const path = new URL(url).pathname.replace(/\/+$/, "") || "/";
        return (path === "/" || path.startsWith("/docs/")) && !/\.[^/]+$/.test(path);
      },
      namespaces: { news: false, xhtml: false, image: false, video: false },
    }),
    seoIntegration(),
  ],
  vite: {
    // Lightning CSS folds scroll timelines into animation shorthand, which
    // browsers reject. Keep Shadcn's scroll-fade declarations separate.
    build: { cssMinify: "esbuild" },
    plugins: [tailwindcss({ optimize: { minify: false } }), registryPlugin(), showcaseVitePlugin()],
  },
});
