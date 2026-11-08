import docsPackage from "./package.json";
import uiPackage from "../../packages/ui/package.json";
import showcasePackage from "../../packages/showcase/package.json";
import { readFileSync, readdirSync } from "node:fs";
import nodePath from "node:path";
import type { Plugin } from "vite-plus";
import { fileURLToPath } from "node:url";

const packageName = (specifier: string) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

// Source compilation and image generation are server-only.
const serverOnlyDependencies = new Set(["satori", "sharp", "gray-matter"]);

// Start must compile these modules before their client/server boundaries are resolved.
const compilerDependencies = new Set(["@tanstack/react-start", "@tanstack/react-router"]);

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = nodePath.join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(path);
    }

    return /\.[cm]?[jt]sx?$/u.test(entry.name) &&
      !/\.(?:test|spec|stories|server)\./u.test(entry.name)
      ? [path]
      : [];
  });

// Explicit nested dependency IDs resolve from their owning workspace, even when
// Bun has not hoisted that dependency into the docs app's node_modules.
const showcaseDependencies = () => {
  const imports = new Map<string, string>();

  const workspaces: {
    relative: string;
    pkg: {
      name: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
  }[] = [
    { pkg: docsPackage, relative: "./" },
    { pkg: uiPackage, relative: "../../packages/ui/" },
    { pkg: showcasePackage, relative: "../../packages/showcase/" },
  ];

  for (const { relative, pkg } of workspaces) {
    const root = fileURLToPath(new URL(relative, import.meta.url));

    const dependencies = new Set(
      Object.keys({
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      }),
    );

    for (const file of sourceFiles(nodePath.join(root, "src"))) {
      const source = readFileSync(file, "utf-8");

      for (const match of source.matchAll(/(?:from\s*|import\s*)["'](?<specifier>[^"']+)["']/gu)) {
        const specifier = match.groups?.specifier;

        if (specifier === undefined) {
          continue;
        }

        if (
          serverOnlyDependencies.has(packageName(specifier)) ||
          compilerDependencies.has(packageName(specifier))
        ) {
          continue;
        }

        if (specifier.startsWith("@erbium/") || !dependencies.has(packageName(specifier))) {
          continue;
        }

        if (!imports.has(specifier)) {
          imports.set(specifier, relative === "./" ? specifier : `${pkg.name} > ${specifier}`);
        }
      }
    }
  }

  return [...imports.values()].toSorted((a, b) => a.localeCompare(b));
};

export const showcaseVitePlugin = (): Plugin => {
  const showcaseRoot = fileURLToPath(new URL("../../packages/showcase/src/", import.meta.url));

  const names = readdirSync(showcaseRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => readdirSync(nodePath.join(showcaseRoot, entry.name)).includes("variants"))
    .map((entry) => entry.name);

  return {
    configEnvironment(name) {
      if (name !== "client") {
        return null;
      }

      // Prebundle dependencies owned by the UI and showcase workspaces,
      // including those only reached by lazy example imports.
      return { optimizeDeps: { include: showcaseDependencies(), noDiscovery: true } };
    },
    enforce: "post",
    load(id) {
      if (id === "\0virtual:docs-preview-loaders") {
        const entries = names.flatMap((name) => {
          const directory = nodePath.join(showcaseRoot, name, "variants");

          return readdirSync(directory)
            .filter((file) => file.endsWith(".tsx"))
            .map(
              (file) =>
                `${JSON.stringify(`${name}/${file.slice(0, -4)}`)}: () => import(${JSON.stringify(nodePath.join(directory, file))})`,
            );
        });

        return `export default {${entries.join(",")}};`;
      }

      return null;
    },
    name: "erbium:showcase-dependencies",
    resolveId(id) {
      if (id === "virtual:docs-preview-loaders") {
        return `\0${id}`;
      }

      return null;
    },
  };
};
