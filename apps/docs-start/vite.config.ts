import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, createRunnableDevEnvironment } from "vite-plus";
import { cp, readFile } from "node:fs/promises";
import { showcaseVitePlugin } from "./preview-plugin.mjs";
import { registryPlugin } from "./registry-plugin.mjs";
import { contentPlugin, navigationMetadata } from "./content-plugin";
import { staticContentPlugin } from "./static-content-plugin.mjs";
const cloudflare = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";
const root = new URL("./", import.meta.url).pathname;
const aliases = {
  "@": new URL("./src", import.meta.url).pathname,
  "@ui": new URL("../../packages/ui", import.meta.url).pathname,
  "@public": new URL("./public", import.meta.url).pathname,
};
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
  environments: cloudflare
    ? undefined
    : {
        ssr: {
          dev: { createEnvironment: (name, config) => createRunnableDevEnvironment(name, config) },
        },
      },
  server: { host: "127.0.0.1", port: 3001, strictPort: true },
  preview: { host: "127.0.0.1", port: 3002, strictPort: true },
  publicDir: "./public",
  resolve: {
    alias: aliases,
  },
  plugins: [
    contentPlugin(),
    staticContentPlugin({
      root,
      aliases,
      pagePaths,
      toolingPlugins: () => [contentPlugin(), showcaseVitePlugin()],
    }),
    {
      ...previewPlugin,
      configEnvironment(name) {
        const config = previewPlugin.configEnvironment(name);
        if (!config) return;
        return {
          optimizeDeps: {
            ...config.optimizeDeps,
            include: ["hast-util-to-jsx-runtime", ...config.optimizeDeps.include],
          },
        };
      },
    },
    tailwindcss({ optimize: { minify: false } }),
    registryPlugin(),
    {
      name: "erbium:start-prerender-preview",
      configurePreviewServer(server) {
        if (cloudflare) return;
        server.middlewares.use(async (request, response, next) => {
          const path = request.url?.split("?")[0] ?? "";
          if ((request.method !== "GET" && request.method !== "HEAD") || !pagePaths.includes(path))
            return next();
          try {
            const html = await readFile(
              new URL(`./dist/client${path === "/" ? "" : path}/index.html`, import.meta.url),
            );
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
            response.end(request.method === "HEAD" ? undefined : html);
          } catch {
            next();
          }
        });
      },
    },
    tanstackStart({
      vite: { installDevServerMiddleware: !cloudflare },
      prerender: { enabled: !cloudflare, crawlLinks: false, failOnError: true },
      pages: pagePaths.map((path) => ({ path })),
      sitemap: { host: "https://ui.erbium.app" },
    }),
    react(),
    {
      name: "erbium:start-assets",
      async closeBundle() {
        if (this.environment.name !== "client") return;
        for (const [source, target] of [
          ["../../packages/ui/public/r", "r/ui"],
          ["../../packages/showcase/public/r", "r/examples"],
          ["../../packages/ui/src/assets/fonts", "fonts"],
        ]) {
          await cp(
            new URL(source, import.meta.url),
            `${this.environment.config.build.outDir}/${target}`,
            { recursive: true },
          );
        }
      },
    },
  ],
  build: { cssMinify: "esbuild" },
});
