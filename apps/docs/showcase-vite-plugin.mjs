import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

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
        if (specifier.startsWith("@erbium/") || !dependencies[packageName(specifier)]) continue;
        if (!imports.has(specifier))
          imports.set(specifier, relative === "./" ? specifier : `${pkg.name} > ${specifier}`);
      }
    }
  }
  return [...imports.values()].sort((a, b) => a.localeCompare(b));
}

export function showcaseVitePlugin() {
  return {
    name: "erbium:showcase-dependencies",
    enforce: "post",
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
