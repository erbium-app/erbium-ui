import cloudflare from "@alchemy.run/cloudflare-runtime/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import { cp } from "node:fs/promises";
import { registryPlugin } from "./registry-plugin.mjs";
import { contentPlugin, navigationMetadata } from "./content-plugin";
import { staticContentPlugin } from "./static-content-plugin";

const root = new URL("./", import.meta.url).pathname;

const pagePaths = [
  "/",
  "/docs/roadmap",
  "/docs/installation",
  "/docs/getting-started",
  "/docs/utilities/shimmer",
  ...navigationMetadata().map((page) => page.href),
];

export default defineConfig(({ isPreview }) => ({
  build: { cssMinify: "esbuild" },
  plugins: [
    // Alchemy injects its own Cloudflare plugin into deploy builds. Start's
    // prerender preview reopens this file without it, so preview keeps ours.
    process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1" && isPreview !== true
      ? undefined
      : cloudflare({
          compatibilityFlags: ["nodejs_compat"],
          // Match the deployed asset routing in local dev and preview.
          worker: { assets: { htmlHandling: "drop-trailing-slash" }, bindings: [], name: "docs" },
        }),
    contentPlugin(),
    staticContentPlugin({ pagePaths, root, toolingPlugins: () => [contentPlugin()] }),
    tailwindcss({ optimize: { minify: false } }),
    registryPlugin(),
    tanstackStart({
      pages: pagePaths.map((path) => ({ path })),
      prerender: { crawlLinks: false, enabled: true, failOnError: true },
      sitemap: { host: "https://ui.erbium.app" },
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
  resolve: { tsconfigPaths: true },
  server: { host: "127.0.0.1", port: 3001, strictPort: true },
}));
