import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = import.meta.dirname;

const registries = {
  "/fonts/": resolve(root, "../../packages/ui/src/assets/fonts"),
  "/r/examples/": resolve(root, "../../packages/showcase/public/r"),
  "/r/ui/": resolve(root, "../../packages/ui/public/r"),
};

export const registryPlugin = () => ({
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const path = request.url?.split("?")[0] ?? "";
      const prefix = Object.keys(registries).find((prefix) => path.startsWith(prefix));
      const filename = prefix ? path.slice(prefix.length) : "";

      if (!prefix) {
        return next();
      }

      const isFont = prefix === "/fonts/";

      if (!(isFont ? /^[\w-]+\.(woff2|txt|md)$/ : /^[\w-]+\.json$/).test(filename)) {
        return next();
      }

      try {
        const content = await readFile(join(registries[prefix], filename));
        response.setHeader(
          "Content-Type",
          isFont ? (filename.endsWith(".woff2") ? "font/woff2" : "text/plain") : "application/json",
        );

        if (isFont) {
          response.setHeader("Access-Control-Allow-Origin", "*");
        }

        response.end(content);
      } catch {
        next();
      }
    });
  },
  name: "erbium-registry",
});
