import { mkdir, readFile, writeFile } from "node:fs/promises";
import nodePath from "node:path";
import { createServer, createRunnableDevEnvironment, isRunnableDevEnvironment } from "vite-plus";
import type { Plugin, ViteDevServer } from "vite-plus";
import type { DocPage } from "./src/content/types";
import type * as ContentPages from "./src/build/content/pages";
import type * as Resources from "./src/build/agent/resources";
import type * as OgPages from "./src/build/seo/og-pages";
import type * as OgImage from "./src/build/seo/og-image";
import type showcaseManifest from "@erbium/showcase/manifest";

interface Options {
  root: string;
  pagePaths: string[];
  toolingPlugins: () => Plugin[];
}

const virtualId = "virtual:docs-pages";
const resolvedId = `\0${virtualId}`;
const pagePrefix = "virtual:docs-page/";

/** Compile content and native image dependencies on Node, never in the Worker. */
export const staticContentPlugin = ({ root, pagePaths, toolingPlugins }: Options): Plugin => {
  let tooling: Promise<ViteDevServer> | undefined;
  let documents: Promise<Record<string, DocPage>> | undefined;

  const server = async () => {
    tooling ??= createServer({
      appType: "custom",
      // Isolate the tooling optimizer from the browser dependency cache.
      cacheDir: nodePath.resolve(root, ".cache/tooling-vite"),
      configFile: false,
      environments: {
        ssr: {
          dev: { createEnvironment: (name, config) => createRunnableDevEnvironment(name, config) },
        },
      },
      logLevel: "error",
      plugins: toolingPlugins(),
      resolve: { tsconfigPaths: true },
      root,
      server: { hmr: false, middlewareMode: true },
    });

    return await tooling;
  };

  const load = async <T>(path: string): Promise<T> => {
    const vite = await server();
    const environment = vite.environments.ssr;

    if (!isRunnableDevEnvironment(environment)) {
      throw new Error("Missing tooling module runner");
    }

    return await environment.runner.import<T>(path);
  };

  const pages = async () => {
    documents ??= (async () => {
      const { getPage } = await load<typeof ContentPages>("/src/build/content/pages.ts");

      return Object.fromEntries(
        await Promise.all(
          pagePaths.map(async (path) => {
            const page = await getPage(path);

            if (!page) {
              throw new Error(`Missing documentation page: ${path}`);
            }

            return [path, page] as const;
          }),
        ),
      );
    })();

    return await documents;
  };

  const resources = async () => {
    const module = await load<typeof Resources>("/src/build/agent/resources.ts");

    return module.artifacts;
  };

  const image = async (path: string) => {
    const { ogPages } = await load<typeof OgPages>("/src/build/seo/og-pages.ts");
    const page = ogPages.find((entry) => entry.imagePath === path);

    if (!page) {
      return null;
    }

    const module = await load<typeof OgImage>("/src/build/seo/og-image.ts");

    return await module.createOgImage(page);
  };

  return {
    buildStart() {
      // Compile documents while other modules transform. The page loader awaits the same
      // memoized promise, so a compile failure still fails that load; settling here only
      // prevents an unhandled rejection before then.
      void Promise.allSettled([pages()]);
    },
    async closeBundle() {
      if (this.environment?.name === "client") {
        const output = nodePath.resolve(root, this.environment.config.build.outDir);

        const write = async (path: string, body: string | Uint8Array) => {
          const target = nodePath.resolve(output, `.${path}`);
          await mkdir(nodePath.dirname(target), { recursive: true });
          await writeFile(target, body);
        };

        const artifacts = await resources();
        await Promise.all(
          artifacts.map(async (artifact) => {
            await write(artifact.path, artifact.body);
          }),
        );

        const { default: manifest } = await load<{ default: typeof showcaseManifest }>(
          `/@fs${nodePath.resolve(root, "../../packages/showcase/manifest.json")}`,
        );

        const { getExampleSource } = await load<typeof ContentPages>("/src/build/content/pages.ts");

        await Promise.all(
          manifest.flatMap((component) =>
            component.variants.map(async (variant) => {
              await write(
                `/examples/${component.name}-${variant.slug}.json`,
                JSON.stringify(await getExampleSource(component.name, variant.slug)),
              );
            }),
          ),
        );

        const { ogPages } = await load<typeof OgPages>("/src/build/seo/og-pages.ts");

        // Image paths hash their content, so unchanged cards are reused from the cache.
        // A small pool overlaps Satori layout with Sharp encoding and bounds image memory.
        const imageCache = nodePath.resolve(root, ".cache/og");
        const queue = [...ogPages];

        const renderImages = async (): Promise<void> => {
          const page = queue.shift();

          if (!page) {
            return;
          }

          const cached = nodePath.join(imageCache, `.${page.imagePath}`);

          const bytes = await readFile(cached).catch(async () => {
            const rendered = await image(page.imagePath);

            if (rendered !== null) {
              await mkdir(nodePath.dirname(cached), { recursive: true });
              await writeFile(cached, rendered);
            }

            return rendered;
          });

          if (bytes !== null) {
            await write(page.imagePath, bytes);
          }

          await renderImages();
        };

        await Promise.all(Array.from({ length: 4 }, renderImages));

        const preview =
          this.environment.config.define?.["import.meta.env.VITE_DOCS_PREVIEW"] === '"true"';

        await write(
          "/_headers",
          `${preview ? "/*\n  X-Robots-Tag: noindex\n\n" : ""}/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/examples/*\n  X-Robots-Tag: noindex\n  Cache-Control: public, max-age=60, must-revalidate\n\n/*.md\n  X-Robots-Tag: noindex\n\n/og/*\n  Cache-Control: public, max-age=3600\n`,
        );
      }

      if (this.environment?.name === "ssr" && tooling) {
        const vite = await tooling;
        await vite.close();
        tooling = undefined;
      }
    },
    configureServer(vite) {
      vite.middlewares.use((request, response, forward) => {
        const handle = async () => {
          const path = request.url?.split("?")[0] ?? "";

          if (request.method !== "GET" && request.method !== "HEAD") {
            forward();

            return;
          }

          try {
            const example = /^\/examples\/(?<example>[\w-]+)\.json$/u.exec(path);

            if (example) {
              const { default: manifest } = await load<{ default: typeof showcaseManifest }>(
                `/@fs${nodePath.resolve(root, "../../packages/showcase/manifest.json")}`,
              );

              const entry = manifest
                .flatMap((component) =>
                  component.variants.map((variant) => ({
                    name: component.name,
                    slug: variant.slug,
                  })),
                )
                .find((item) => `${item.name}-${item.slug}` === example.groups?.example);

              if (!entry) {
                forward();

                return;
              }

              const { getExampleSource } = await load<typeof ContentPages>(
                "/src/build/content/pages.ts",
              );

              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify(await getExampleSource(entry.name, entry.slug)));

              return;
            }

            if (path.startsWith("/og/")) {
              const bytes = await image(path);

              if (bytes === null) {
                forward();

                return;
              }

              response.setHeader("Content-Type", "image/jpeg");
              response.end(request.method === "HEAD" ? undefined : bytes);

              return;
            }

            if (!/\.(?:md|json|txt)$/u.test(path)) {
              forward();

              return;
            }

            const artifacts = await resources();
            const artifact = artifacts.find((entry) => entry.path === path);

            if (!artifact) {
              forward();

              return;
            }

            response.setHeader("Content-Type", `${artifact.type}; charset=utf-8`);
            response.setHeader("X-Robots-Tag", "noindex");
            response.end(request.method === "HEAD" ? undefined : artifact.body);
          } catch (error) {
            forward(error);
          }
        };

        void handle();
      });
      vite.watcher.on("change", (file) => {
        if (!/packages\/(?:content|showcase|ui)\//u.test(file)) {
          return;
        }

        documents = undefined;

        for (const environment of Object.values(vite.environments)) {
          for (const module of environment.moduleGraph.idToModuleMap.values()) {
            if (module.id === resolvedId || module.id?.startsWith(`\0${pagePrefix}`) === true) {
              environment.moduleGraph.invalidateModule(module);
            }
          }
        }

        vite.ws.send({ type: "full-reload" });
      });
    },
    load: {
      filter: { id: /^\0virtual:docs-page/u },
      async handler(id) {
        if (id === resolvedId) {
          return `export default {${pagePaths.map((path) => `${JSON.stringify(path)}: () => import(${JSON.stringify(pagePrefix + path)})`).join(",")}};`;
        }

        if (id.startsWith(`\0${pagePrefix}`)) {
          const path = id.slice(pagePrefix.length + 1);
          const compiled = await pages();
          const page = Object.hasOwn(compiled, path) ? compiled[path] : undefined;

          if (!page) {
            throw new Error(`Missing documentation page: ${path}`);
          }

          return `export default ${JSON.stringify(page)};`;
        }

        return null;
      },
    },
    name: "erbium:static-content",
    resolveId: {
      filter: { id: /^virtual:docs-page/u },
      handler(id) {
        return id === virtualId || id.startsWith(pagePrefix) ? `\0${id}` : null;
      },
    },
  };
};
