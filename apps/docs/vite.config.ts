import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, createRunnableDevEnvironment } from "vite-plus";
import { cp, readFile } from "node:fs/promises";
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

export default defineConfig({
  build: { cssMinify: "esbuild" },
  environments: cloudflare
    ? undefined
    : {
        ssr: {
          dev: { createEnvironment: (name, config) => createRunnableDevEnvironment(name, config) },
        },
      },
  plugins: [
    contentPlugin(),
    staticContentPlugin({
      pagePaths,
      root,
      toolingPlugins: () => [contentPlugin(), showcaseVitePlugin()],
    }),
    previewPlugin,
    tailwindcss({ optimize: { minify: false } }),
    registryPlugin(),
    {
      async configurePreviewServer(server) {
        if (cloudflare) {
          return;
        }

        const pages = await Promise.all(
          pagePaths.map(async (path) => {
            try {
              const html = await readFile(
                new URL(`dist/client${path === "/" ? "" : path}/index.html`, import.meta.url),
              );

              return { html, path };
            } catch {
              return { html: undefined, path };
            }
          }),
        );

        const documents = new Map(pages.map((page) => [page.path, page.html]));

        server.middlewares.use((request, response, next) => {
          const path = request.url?.split("?")[0] ?? "";
          const html = documents.get(path);

          if ((request.method !== "GET" && request.method !== "HEAD") || html === undefined) {
            next();

            return;
          }

          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
          response.end(request.method === "HEAD" ? undefined : html);
        });
      },
      name: "erbium:start-prerender-preview",
    },
    tanstackStart({
      pages: pagePaths.map((path) => ({ path })),
      prerender: { crawlLinks: false, enabled: !cloudflare, failOnError: true },
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
});
