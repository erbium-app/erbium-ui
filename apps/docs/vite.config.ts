import cloudflareRuntime from "@alchemy.run/cloudflare-runtime/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, createRunnableDevEnvironment } from "vite-plus";
import { cp } from "node:fs/promises";
import { showcaseVitePlugin } from "./preview-plugin";
import { registryPlugin } from "./registry-plugin.mjs";
import { contentPlugin, navigationMetadata } from "./content-plugin";
import { staticContentPlugin } from "./static-content-plugin";

const cloudflare = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";
const root = new URL("./", import.meta.url).pathname;

const previewPlugin = showcaseVitePlugin();

const pagePaths = [
  "/",
  "/docs/roadmap",
  "/docs/installation",
  "/docs/getting-started",
  "/docs/utilities/shimmer",
  ...navigationMetadata().map((page) => page.href),
];

export default defineConfig(({ isPreview }) => ({
  build: { cssMinify: "esbuild", outDir: process.env.ERBIUM_DOCS_OUTPUT_DIR ?? "dist" },
  environments: cloudflare
    ? undefined
    : {
        ssr: {
          dev: { createEnvironment: (name, config) => createRunnableDevEnvironment(name, config) },
        },
      },
  plugins: [
    // Start reopens the config for prerendering without Alchemy's inline plugins.
    // Restore the Worker preview handler only in that preview process.
    isPreview === true && cloudflare
      ? cloudflareRuntime({
          compatibilityDate: "2026-09-25",
          compatibilityFlags: ["nodejs_compat"],
        })
      : undefined,
    contentPlugin(),
    staticContentPlugin({
      pagePaths,
      root,
      toolingPlugins: () => [contentPlugin(), showcaseVitePlugin()],
    }),
    previewPlugin,
    tailwindcss({ optimize: { minify: false } }),
    registryPlugin(),
    tanstackStart({
      pages: pagePaths.map((path) => ({ path })),
      prerender: { crawlLinks: false, enabled: true, failOnError: true },
      sitemap: { host: "https://ui.erbium.app" },
      vite: { installDevServerMiddleware: !cloudflare },
    }),
    react(),
    {
      async closeBundle() {
        if (this.environment.name !== "client") {
          return;
        }

        await Promise.all(
          [
            ["../../packages/ui/public/r", "r/ui"],
            ["../../packages/showcase/public/r", "r/examples"],
            ["../../packages/ui/src/assets/fonts", "fonts"],
          ].map(async ([source, target]) => {
            await cp(
              new URL(source, import.meta.url),
              `${this.environment.config.build.outDir}/${target}`,
              { recursive: true },
            );
          }),
        );
      },
      name: "erbium:start-assets",
    },
  ],
  preview: { host: "127.0.0.1", port: 3002, strictPort: true },
  publicDir: "./public",
  resolve: {
    tsconfigPaths: true,
  },
  server: { host: "127.0.0.1", port: 3001, strictPort: true },
}));
