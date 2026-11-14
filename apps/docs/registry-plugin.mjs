import { publishRevisions } from "../../packages/cli/src/publish.ts";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** @typedef {import("vite-plus").Plugin} Plugin */
/** @typedef {import("vite-plus").Connect.NextFunction} NextFunction */
/** @typedef {import("node:http").ServerResponse} ServerResponse */

const root = import.meta.dirname;
const fontPrefix = "/fonts/";
const fontFile = /^[\w-]+\.(?:woff2|txt|md)$/u;
const registryFile = /^[\w-]+\.json$/u;

/** @type {Record<string, string>} */
const registries = {
  [fontPrefix]: path.resolve(root, "../../packages/ui/src/assets/fonts"),
  "/r/examples/": path.resolve(root, "../../packages/showcase/public/r"),
  "/r/ui/": path.resolve(root, "../../packages/ui/public/r"),
};

/**
 * @param {string} filename - The requested file name.
 * @param {boolean} isFont - Whether the request is for the fonts directory.
 * @returns {string} The response Content-Type.
 */
const contentType = (filename, isFont) => {
  if (!isFont) {
    return "application/json";
  }

  return filename.endsWith(".woff2") ? "font/woff2" : "text/plain";
};

/**
 * Sends one registry file, or hands the request on when it cannot be read.
 * @param {string} file - The absolute file path.
 * @param {string} filename - The requested file name.
 * @param {boolean} isFont - Whether the request is for the fonts directory.
 * @param {ServerResponse} response - The dev server response.
 * @param {NextFunction} next - Passes the request to the next middleware.
 * @returns {Promise<void>} Settles once the response is sent or handed on.
 */
const serve = async (file, filename, isFont, response, next) => {
  /** @type {Buffer} */
  let content;

  try {
    content = await readFile(file);
  } catch {
    next();

    return;
  }

  response.setHeader("Content-Type", contentType(filename, isFont));

  if (isFont) {
    response.setHeader("Access-Control-Allow-Origin", "*");
  }

  response.end(content);
};

/** @returns {Plugin} Serves the UI and example registries and fonts in development. */
export const registryPlugin = () => ({
  async configureServer(server) {
    const versions = path.resolve(root, ".cache/registry");
    await publishRevisions(versions, false);
    server.middlewares.use((request, response, next) => {
      const [pathname = ""] = request.url?.split("?") ?? [];

      const revisionFile =
        /^\/r\/erbium\/(?<file>(?:index|history)\.json|revisions\/[a-f0-9]{64}\.json)$/u.exec(
          pathname,
        )?.groups?.file;

      if (revisionFile === undefined) {
        next();

        return;
      }

      void serve(path.join(versions, revisionFile), revisionFile, false, response, next);
    });
    server.middlewares.use((request, response, next) => {
      const [pathname = ""] = request.url?.split("?") ?? [];
      const prefix = Object.keys(registries).find((candidate) => pathname.startsWith(candidate));

      if (prefix === undefined) {
        next();

        return;
      }

      const filename = pathname.slice(prefix.length);
      const isFont = prefix === fontPrefix;

      if (!(isFont ? fontFile : registryFile).test(filename)) {
        next();

        return;
      }

      void serve(path.join(registries[prefix] ?? "", filename), filename, isFont, response, next);
    });
  },
  name: "erbium-registry",
});
