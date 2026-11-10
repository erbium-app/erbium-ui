import { mkdir, readFile, writeFile } from "node:fs/promises";
import nodePath from "node:path";
import { createRunnableDevEnvironment, isRunnableDevEnvironment, resolveConfig } from "vite-plus";
import type {
  EnvironmentModuleNode,
  Plugin,
  RunnableDevEnvironment,
  ViteDevServer,
} from "vite-plus";
import type { DocPage } from "./src/content/types";
import type * as ContentPages from "./src/build/content/pages";
import type * as Resources from "./src/build/agent/resources";
import type * as OgPages from "./src/build/seo/og-pages";
import type * as OgImage from "./src/build/seo/og-image";

interface Options {
  root: string;
  pagePaths: string[];
  toolingPlugins: () => Plugin[];
}

const virtualId = "virtual:docs-pages";
const resolvedId = `\0${virtualId}`;
const pagePrefix = "virtual:docs-page/";

// Content modules use Node-only packages (gray-matter, Shiki, Satori, Sharp), so
// they run in this Node environment instead of the Worker.
const environmentName = "content";

/** Compile content and native image dependencies on Node, never in the Worker. */
export const staticContentPlugin = ({ root, pagePaths, toolingPlugins }: Options): Plugin => {
  let devServer: ViteDevServer | undefined;
  let buildEnvironment: Promise<RunnableDevEnvironment> | undefined;

  // Dev runs content in an environment of the same server, so it shares the
  // watcher and module graph. `vite build` has no dev server, so it creates the
  // same kind of environment on its own and closes it once the bundle is written.
  const contentEnvironment = async () => {
    if (devServer) {
      const content = devServer.environments[environmentName];

      if (!isRunnableDevEnvironment(content)) {
        throw new Error("Missing content module runner");
      }

      return content;
    }

    buildEnvironment ??= (async () => {
      const config = await resolveConfig(
        {
          configFile: false,
          environments: { [environmentName]: { consumer: "server" } },
          logLevel: "error",
          plugins: toolingPlugins(),
          resolve: { tsconfigPaths: true },
          root,
        },
        "serve",
      );

      const content = createRunnableDevEnvironment(environmentName, config, { hot: false });
      await content.init();

      return content;
    })();

    return await buildEnvironment;
  };

  const closeBuildEnvironment = async () => {
    const pending = buildEnvironment;
    buildEnvironment = undefined;
    const content = await pending;
    await content?.close();
  };

  const load = async <T>(path: string): Promise<T> => {
    const content = await contentEnvironment();

    return await content.runner.import<T>(path);
  };

  // A changed source gives the page builder a new module instance, which drops
  // every page compiled from the old one.
  let compiled: { module: typeof ContentPages; pages: Map<string, Promise<DocPage>> } | undefined;

  const page = async (path: string) => {
    const module = await load<typeof ContentPages>("/src/build/content/pages.ts");

    if (compiled?.module !== module) {
      compiled = { module, pages: new Map() };
    }

    let request = compiled.pages.get(path);

    if (!request) {
      request = (async () => {
        const result = await module.getPage(path);

        if (!result) {
          throw new Error(`Missing documentation page: ${path}`);
        }

        return result;
      })();
      compiled.pages.set(path, request);
    }

    return await request;
  };

  const resources = async () => {
    const module = await load<typeof Resources>("/src/build/agent/resources.ts");

    return module.artifacts;
  };

  const image = async (path: string) => {
    const { ogPages } = await load<typeof OgPages>("/src/build/seo/og-pages.ts");
    const entry = ogPages.find((candidate) => candidate.imagePath === path);

    if (!entry) {
      return null;
    }

    const module = await load<typeof OgImage>("/src/build/seo/og-image.ts");

    return await module.createOgImage(entry);
  };

  // Page JSON that dev clients last received, so a change reloads only when it differs.
  const served = new Map<string, string>();

  return {
    buildStart() {
      if (devServer) {
        return;
      }

      // Compile documents while other modules transform. Each page load awaits the same
      // memoized request, so a compile failure still fails that load; settling here only
      // prevents an unhandled rejection before then.
      void Promise.allSettled(pagePaths.map(page));
    },
    async closeBundle() {
      if (devServer) {
        return;
      }

      if (this.environment.name === "client") {
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

        const { getExampleSource, listExamples } = await load<typeof ContentPages>(
          "/src/build/content/pages.ts",
        );

        await Promise.all(
          listExamples().map(async ({ name, slug }) => {
            await write(
              `/examples/${name}-${slug}.json`,
              JSON.stringify(await getExampleSource(name, slug)),
            );
          }),
        );

        const { ogPages } = await load<typeof OgPages>("/src/build/seo/og-pages.ts");

        // Image paths hash their content, so unchanged cards are reused from the cache.
        // A small pool overlaps Satori layout with Sharp encoding and bounds image memory.
        const imageCache = nodePath.resolve(root, ".cache/og");
        const queue = [...ogPages];

        const renderImages = async (): Promise<void> => {
          const entry = queue.shift();

          if (!entry) {
            return;
          }

          const cached = nodePath.join(imageCache, `.${entry.imagePath}`);

          const bytes = await readFile(cached).catch(async () => {
            const rendered = await image(entry.imagePath);

            if (rendered !== null) {
              await mkdir(nodePath.dirname(cached), { recursive: true });
              await writeFile(cached, rendered);
            }

            return rendered;
          });

          if (bytes !== null) {
            await write(entry.imagePath, bytes);
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

      // A later environment build recreates it if it still needs content.
      await closeBuildEnvironment();
    },
    config(_config, { command, isPreview }) {
      if (command !== "serve" || isPreview === true) {
        return null;
      }

      return {
        environments: {
          [environmentName]: {
            consumer: "server",
            dev: {
              // The change handler below applies content edits, so the runner needs no HMR.
              createEnvironment: (name, config) =>
                createRunnableDevEnvironment(name, config, { hot: false }),
            },
          },
        },
      };
    },
    configureServer(vite) {
      devServer = vite;
      compiled = undefined;
      served.clear();

      const reloadChangedPages = async () => {
        const changes = await Promise.all(
          [...served].map(async ([path, json]) => {
            try {
              return JSON.stringify(await page(path)) !== json;
            } catch (error) {
              vite.config.logger.error(`Failed to recompile ${path}: ${String(error)}`, {
                error: error instanceof Error ? error : undefined,
                timestamp: true,
              });

              // Reloading shows the error through the page load that fails.
              return true;
            }
          }),
        );

        if (changes.includes(true)) {
          vite.environments.client.hot.send({ type: "full-reload" });
        }
      };

      let reloading = Promise.resolve();

      vite.watcher.on("change", (file) => {
        const content = vite.environments[environmentName];

        if (!isRunnableDevEnvironment(content)) {
          return;
        }

        // Walk the content module graph from the changed file to everything that
        // depends on it. The graph includes glob members and files plugins watch, so
        // Markdown, story args, registries, and styles all reach their importers.
        // Vite invalidates transforms only after its own async watch hooks, so do it
        // here before anything re-imports.
        const stale = new Set<EnvironmentModuleNode>();

        const visit = (module: EnvironmentModuleNode) => {
          if (stale.has(module)) {
            return;
          }

          stale.add(module);
          content.moduleGraph.invalidateModule(module);

          for (const importer of module.importers) {
            visit(importer);
          }
        };

        for (const module of content.moduleGraph.getModulesByFile(file) ?? []) {
          visit(module);
        }

        if (stale.size === 0) {
          // Not content. Components and examples update through React Fast Refresh.
          return;
        }

        const { evaluatedModules } = content.runner;

        for (const module of stale) {
          const evaluated =
            module.id === null ? undefined : evaluatedModules.getModuleById(module.id);

          if (evaluated) {
            evaluatedModules.invalidateModule(evaluated);
          }
        }

        // The next request for a page module reads the recompiled page.
        for (const environment of Object.values(vite.environments)) {
          for (const module of environment.moduleGraph.idToModuleMap.values()) {
            if (module.id?.startsWith(`\0${pagePrefix}`) === true) {
              environment.moduleGraph.invalidateModule(module);
            }
          }
        }

        reloading = reloading.then(reloadChangedPages);
      });

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
              const { getExampleSource, listExamples } = await load<typeof ContentPages>(
                "/src/build/content/pages.ts",
              );

              const entry = listExamples().find(
                (item) => `${item.name}-${item.slug}` === example.groups?.example,
              );

              if (!entry) {
                forward();

                return;
              }

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
    },
    hotUpdate() {
      // The change handler in configureServer already applied the edit to the content
      // runner, which has no HMR channel to send a reload to.
      return this.environment.name === environmentName ? [] : undefined;
    },
    load: {
      filter: { id: /^\0virtual:docs-page/u },
      async handler(id) {
        if (id === resolvedId) {
          return `export default {${pagePaths.map((path) => `${JSON.stringify(path)}: () => import(${JSON.stringify(pagePrefix + path)})`).join(",")}};`;
        }

        if (id.startsWith(`\0${pagePrefix}`)) {
          const path = id.slice(pagePrefix.length + 1);

          if (!pagePaths.includes(path)) {
            throw new Error(`Missing documentation page: ${path}`);
          }

          const json = JSON.stringify(await page(path));

          if (devServer) {
            served.set(path, json);
          }

          return `export default ${json};`;
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
