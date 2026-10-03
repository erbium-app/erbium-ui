import { cp, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const registries = {
  "/r/ui/": resolve(root, "../../packages/ui/public/r"),
  "/r/examples/": resolve(root, "../../packages/showcase/public/r"),
};
export function registryPlugin() {
  return {
    name: "erbium-registry",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0] ?? "";
        const prefix = Object.keys(registries).find((prefix) => path.startsWith(prefix));
        const filename = prefix ? path.slice(prefix.length) : "";
        if (!prefix || !/^[\w-]+\.json$/.test(filename)) return next();
        try {
          const content = await readFile(join(registries[prefix], filename));
          response.setHeader("Content-Type", "application/json");
          response.end(content);
        } catch {
          next();
        }
      });
    },
  };
}
export function registryIntegration() {
  return {
    name: "erbium-registry-artifacts",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        for (const [prefix, source] of Object.entries(registries))
          await cp(source, new URL(prefix.slice(1), dir), { recursive: true });
      },
    },
  };
}
