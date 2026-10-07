import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buttonVariants } from "../../packages/ui/src/lib/button-variants.ts";

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

// Image generation only runs in Astro's server/build environment.
const serverOnlyDependencies = new Set(["satori", "sharp"]);

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) && !/\.(test|spec|stories)\./.test(entry.name)
      ? [path]
      : [];
  });
}

// Explicit nested dependency IDs resolve from their owning workspace, even when
// Bun has not hoisted that dependency into the docs app's node_modules.
function showcaseDependencies() {
  const imports = new Map();
  for (const relative of ["./", "../../packages/ui/", "../../packages/showcase/"]) {
    const root = fileURLToPath(new URL(relative, import.meta.url));
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const dependencies = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies };
    for (const file of sourceFiles(join(root, "src"))) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
        const specifier = match[1];
        if (serverOnlyDependencies.has(packageName(specifier))) continue;
        if (specifier.startsWith("@erbium/") || !dependencies[packageName(specifier)]) continue;
        if (!imports.has(specifier))
          imports.set(specifier, relative === "./" ? specifier : `${pkg.name} > ${specifier}`);
      }
    }
  }
  return [...imports.values()].sort((a, b) => a.localeCompare(b));
}

export function showcaseVitePlugin() {
  const previewPrefix = "virtual:docs-preview/";
  const showcaseRoot = fileURLToPath(new URL("../../packages/showcase/src/", import.meta.url));
  const names = readdirSync(showcaseRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => readdirSync(join(showcaseRoot, entry.name)).includes("variants"))
    .map((entry) => entry.name);
  return {
    name: "erbium:showcase-dependencies",
    enforce: "post",
    resolveId(id) {
      if (id === "virtual:docs-preview-loaders" || id.startsWith(previewPrefix)) return `\0${id}`;
    },
    load(id) {
      if (id === "\0virtual:docs-preview-loaders") {
        return `export default {${names.map((name) => `${JSON.stringify(name)}: () => import(${JSON.stringify(previewPrefix + name)})`).join(",")}};`;
      }
      if (!id.startsWith(`\0${previewPrefix}`)) return;
      const name = id.slice(previewPrefix.length + 1);
      if (!names.includes(name)) return;
      const directory = join(showcaseRoot, name, "variants");
      return `export default {${readdirSync(directory)
        .filter((file) => file.endsWith(".tsx"))
        .map(
          (file) =>
            `${JSON.stringify(file.slice(0, -4))}: () => import(${JSON.stringify(join(directory, file))})`,
        )
        .join(",")}};`;
    },
    configEnvironment(name) {
      if (name !== "client") return;
      // Astro configures its own client scan entries. Include all lazy catalog
      // dependencies here rather than relying on global optimizeDeps.entries.
      return { optimizeDeps: { include: showcaseDependencies(), noDiscovery: true } };
    },
  };
}

export function showcaseIntegration() {
  return {
    name: "erbium:showcase-cache",
    hooks: {
      "astro:config:setup": ({ command, updateConfig }) => {
        // Derive the static button base from the UI source of truth on every
        // dev/build start. Tailwind resolves CSS imports from real files.
        const directory = fileURLToPath(new URL("./.astro/", import.meta.url));
        mkdirSync(directory, { recursive: true });
        const base = buttonVariants({ variant: null, size: null })
          .split(" ")
          .filter((token) => token !== "group/button")
          .join(" ");
        writeFileSync(
          join(directory, "button.css"),
          `@layer components { .docs-button { @apply ${base}; } }`,
        );
        // Astro may create an internal Vite server while building. Use Astro's
        // command here so that server cannot replace the live dev optimizer cache.
        updateConfig({
          vite: {
            cacheDir: fileURLToPath(
              new URL(`./node_modules/.vite/astro-${command}/`, import.meta.url),
            ),
          },
        });
      },
    },
  };
}
