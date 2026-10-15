import { createServer } from "vite-plus";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const virtualId = "virtual:docs-pages";
const resolvedId = `\0${virtualId}`;

/** Compile content and native image dependencies on Node, never in the Worker. */
export function staticContentPlugin({ root, aliases, pagePaths, toolingPlugins }) {
  let tooling;
  let documents;
  async function server() {
    tooling ??= createServer({
      root,
      configFile: false,
      // Tooling has a different dependency graph; sharing the app's optimizer
      // cache invalidates browser modules with 504 "Outdated Optimize Dep".
      cacheDir: resolve(root, ".cache/tooling-vite"),
      resolve: { alias: aliases },
      plugins: toolingPlugins(),
      server: { middlewareMode: true },
      appType: "custom",
      logLevel: "error",
    });
    return tooling;
  }
  async function load(path) {
    return (await server()).ssrLoadModule(path);
  }
  async function pages() {
    documents ??= (async () => {
      const { getPage } = await load("/src/build/content/pages.ts");
      return Object.fromEntries(
        await Promise.all(
          pagePaths.map(async (path) => {
            const page = await getPage(path);
            if (!page) throw new Error(`Missing documentation page: ${path}`);
            return [path, page];
          }),
        ),
      );
    })();
    return documents;
  }
  async function resources() {
    return (await load("/src/build/agent/resources.ts")).artifacts;
  }
  async function image(path) {
    const { ogPages } = await load("/src/build/seo/og-pages.ts");
    const page = ogPages.find((entry) => entry.imagePath === path);
    if (!page) return;
    return (await load("/src/build/seo/og-image.ts")).createOgImage(page);
  }
  return {
    name: "erbium:static-content",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    async load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(await pages())};`;
    },
    configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0] ?? "";
        if (request.method !== "GET" && request.method !== "HEAD") return next();
        try {
          const example = /^\/examples\/([\w-]+)\.json$/.exec(path);
          if (example) {
            const { default: manifest } = await load(
              "/@fs" + resolve(root, "../../packages/showcase/manifest.json"),
            );
            const entry = manifest
              .flatMap((component) =>
                component.variants.map((variant) => ({ name: component.name, slug: variant.slug })),
              )
              .find((item) => `${item.name}-${item.slug}` === example[1]);
            if (!entry) return next();
            const { getExampleSource } = await load("/src/build/content/pages.ts");
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(getExampleSource(entry.name, entry.slug)));
            return;
          }
          if (path.startsWith("/og/")) {
            const bytes = await image(path);
            if (!bytes) return next();
            response.setHeader("Content-Type", "image/jpeg");
            response.end(request.method === "HEAD" ? undefined : bytes);
            return;
          }
          if (!/\.(md|json|txt)$/.test(path)) return next();
          const artifact = (await resources()).find((entry) => entry.path === path);
          if (!artifact) return next();
          response.setHeader("Content-Type", `${artifact.type}; charset=utf-8`);
          response.setHeader("X-Robots-Tag", "noindex");
          response.end(request.method === "HEAD" ? undefined : artifact.body);
        } catch (error) {
          next(error);
        }
      });
      vite.watcher.on("change", (file) => {
        if (!/packages\/(content|showcase|ui)\//.test(file)) return;
        documents = undefined;
        const module = vite.environments.ssr?.moduleGraph.getModuleById(resolvedId);
        if (module) vite.environments.ssr.moduleGraph.invalidateModule(module);
      });
    },
    async closeBundle() {
      if (this.environment?.name === "client") {
        const output = resolve(root, this.environment.config.build.outDir);
        async function write(path, body) {
          const target = resolve(output, `.${path}`);
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, body);
        }
        for (const artifact of await resources()) await write(artifact.path, artifact.body);
        const { default: manifest } = await load(
          "/@fs" + resolve(root, "../../packages/showcase/manifest.json"),
        );
        const { getExampleSource } = await load("/src/build/content/pages.ts");
        for (const component of manifest)
          for (const variant of component.variants) {
            await write(
              `/examples/${component.name}-${variant.slug}.json`,
              JSON.stringify(getExampleSource(component.name, variant.slug)),
            );
          }
        const { ogPages } = await load("/src/build/seo/og-pages.ts");
        for (const page of ogPages) await write(page.imagePath, await image(page.imagePath));
        const preview =
          this.environment.config.define?.["import.meta.env.VITE_DOCS_PREVIEW"] === '"true"';
        await write(
          "/_headers",
          `${preview ? "/*\n  X-Robots-Tag: noindex\n\n" : ""}/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/examples/*\n  X-Robots-Tag: noindex\n  Cache-Control: public, max-age=60, must-revalidate\n\n/*.md\n  X-Robots-Tag: noindex\n\n/og/*\n  Cache-Control: public, max-age=3600\n`,
        );
      }
      if (this.environment?.name === "ssr" && tooling) {
        await (await tooling).close();
        tooling = undefined;
      }
    },
  };
}
