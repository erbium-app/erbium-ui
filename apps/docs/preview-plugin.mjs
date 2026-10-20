import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

// Source compilation and image generation are server-only.
const serverOnlyDependencies = new Set(["satori", "sharp", "gray-matter"]);

// Start must compile these modules before their client/server boundaries are resolved.
const compilerDependencies = new Set(["@tanstack/react-start", "@tanstack/react-router"]);

const sourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(path);
    }

    return /\.[cm]?[jt]sx?$/.test(entry.name) && !/\.(test|spec|stories|server)\./.test(entry.name)
      ? [path]
      : [];
  });

// Explicit nested dependency IDs resolve from their owning workspace, even when
// Bun has not hoisted that dependency into the docs app's node_modules.
const showcaseDependencies = () => {
  const imports = new Map();

  for (const relative of ["./", "../../packages/ui/", "../../packages/showcase/"]) {
    const root = fileURLToPath(new URL(relative, import.meta.url));
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
    const dependencies = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies };

    for (const file of sourceFiles(join(root, "src"))) {
      const source = readFileSync(file, "utf-8");

      for (const match of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
        const specifier = match[1];

        if (
          serverOnlyDependencies.has(packageName(specifier)) ||
          compilerDependencies.has(packageName(specifier))
        ) {
          continue;
        }

        if (specifier.startsWith("@erbium/") || !dependencies[packageName(specifier)]) {
          continue;
        }

        if (!imports.has(specifier)) {
          imports.set(specifier, relative === "./" ? specifier : `${pkg.name} > ${specifier}`);
        }
      }
    }
  }

  return [...imports.values()].sort((a, b) => a.localeCompare(b));
};

export const showcaseVitePlugin = () => {
  const previewPrefix = "virtual:docs-preview/";
  const showcaseRoot = fileURLToPath(new URL("../../packages/showcase/src/", import.meta.url));

  const names = readdirSync(showcaseRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => readdirSync(join(showcaseRoot, entry.name)).includes("variants"))
    .map((entry) => entry.name);

  return {
    configEnvironment(name) {
      if (name !== "client") {
        return;
      }

      // Prebundle dependencies owned by the UI and showcase workspaces,
      // including those only reached by lazy example imports.
      return { optimizeDeps: { include: showcaseDependencies(), noDiscovery: true } };
    },
    enforce: "post",
    load(id) {
      if (id === "\0virtual:docs-preview-loaders") {
        return `export default {${names.map((name) => `${JSON.stringify(name)}: () => import(${JSON.stringify(previewPrefix + name)})`).join(",")}};`;
      }

      if (!id.startsWith(`\0${previewPrefix}`)) {
        return;
      }

      const name = id.slice(previewPrefix.length + 1);

      if (!names.includes(name)) {
        return;
      }

      const directory = join(showcaseRoot, name, "variants");

      return `export default {${readdirSync(directory)
        .filter((file) => file.endsWith(".tsx"))
        .map(
          (file) =>
            `${JSON.stringify(file.slice(0, -4))}: () => import(${JSON.stringify(join(directory, file))})`,
        )
        .join(",")}};`;
    },
    name: "erbium:showcase-dependencies",
    resolveId(id) {
      if (id === "virtual:docs-preview-loaders" || id.startsWith(previewPrefix)) {
        return `\0${id}`;
      }
    },
  };
};
