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
      name: "Vazirmatn",
      cssVariable: "--font-docs-arabic",
      display: "swap",
      // Keep this script-specific face ahead of Cal Sans without adding
      // generic or metric-adjusted fallbacks that would capture Latin text.
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            // Fontsource's Arabic variable subset, vendored with its OFL license.
            src: ["./src/assets/fonts/Vazirmatn-Arabic-VF.woff2"],
            weight: "100 900",
            style: "normal",
            // Exclude shared punctuation so English alone never requests it.
            unicodeRange: [
              "U+0600-06FF",
              "U+0750-077F",
              "U+0870-089F",
              "U+08A0-08FF",
              "U+FB50-FDFF",
              "U+FE70-FEFF",
              "U+10EC0-10EFF",
              "U+1EE00-1EEFF",
            ],
          },
        ],
      },
    },
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
    "/docs/shimmer": "/docs/utilities/shimmer",
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
