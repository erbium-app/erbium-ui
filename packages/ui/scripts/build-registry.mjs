import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceRoot = join(packageRoot, "src");
const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const dependencies = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
const title = (name) =>
  name.replace(/(^|-)(\w)/g, (_, __, character) => ` ${character.toUpperCase()}`).trim();
const readImports = (source) =>
  [...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map((match) => match[1]);

async function getInternalItem(specifier, sourceFile) {
  if (!specifier.startsWith(".")) return null;
  const basePath = resolve(dirname(sourceFile), specifier);
  for (const extension of [".tsx", ".ts", ".jsx", ".js", ".css"]) {
    const filePath = `${basePath}${extension}`;
    try {
      if ((await stat(filePath)).isFile()) return filePath;
    } catch {
      // Try the next supported source extension.
    }
  }
  return null;
}

const filesIn = async (directory) =>
  (await readdir(directory, { withFileTypes: true })).flatMap((entry) =>
    entry.isDirectory() ? [] : [entry.name],
  );
const filesInRecursive = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = join(directory, entry.name);
      return entry.isDirectory() ? filesInRecursive(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
};

const itemBySource = new Map();
const componentRoot = join(sourceRoot, "components");
for (const filePath of await filesInRecursive(componentRoot)) {
  if ([".ts", ".tsx"].includes(extname(filePath))) {
    const relativePath = relative(componentRoot, filePath).slice(0, -extname(filePath).length);
    const name = relativePath
      .replace(/^stateful\/stateful-/, "stateful/")
      .split(sep)
      .join("-");
    itemBySource.set(filePath, name);
  }
}
for (const file of await filesIn(join(sourceRoot, "hooks"))) {
  if ([".ts", ".tsx"].includes(extname(file)))
    itemBySource.set(join(sourceRoot, "hooks", file), file.slice(0, -extname(file).length));
}
for (const file of await filesIn(join(sourceRoot, "lib"))) {
  if ([".ts", ".tsx"].includes(extname(file)))
    itemBySource.set(join(sourceRoot, "lib", file), file.slice(0, -extname(file).length));
}

async function itemFor(sourceFile, name, type) {
  const source = await readFile(sourceFile, "utf8");
  const registryDependencies = new Set();
  const npmDependencies = new Set();
  for (const specifier of readImports(source)) {
    const internalFile = await getInternalItem(specifier, sourceFile);
    if (internalFile && itemBySource.has(internalFile)) {
      registryDependencies.add(`@erbium/${itemBySource.get(internalFile)}`);
      continue;
    }
    if (!specifier.startsWith(".") && dependencies.has(packageName(specifier))) {
      npmDependencies.add(packageName(specifier));
    }
  }

  const sourcePath = relative(packageRoot, sourceFile).split(sep).join("/");
  return {
    name,
    type,
    title: title(name),
    description: `Erbium ${name.replaceAll("-", " ")} ${type === "registry:ui" ? "component" : type.slice("registry:".length)}.`,
    ...(npmDependencies.size
      ? { dependencies: [...npmDependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    ...(registryDependencies.size
      ? { registryDependencies: [...registryDependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    files: [{ path: sourcePath, type, target: `~/src/${sourcePath.slice("src/".length)}` }],
  };
}

const items = [];
for (const [sourceFile, name] of itemBySource) {
  const directory = relative(sourceRoot, dirname(sourceFile)).split(sep)[0];
  const type =
    directory === "components"
      ? "registry:ui"
      : directory === "hooks"
        ? "registry:hook"
        : "registry:lib";
  items.push(await itemFor(sourceFile, name, type));
}

// Global styles rely on Tailwind v4 and the listed plugins. Preserve the source
// layout so the relative CSS imports continue to work in the consuming project.
const styleFiles = (await filesIn(join(sourceRoot, "styles")))
  .filter((file) => file.endsWith(".css"))
  .sort();
items.push({
  name: "styles",
  type: "registry:item",
  title: "Erbium styles",
  description: "Erbium global styles, theme tokens, fonts, and Tailwind utilities.",
  dependencies: [
    "@fontsource-variable/geist",
    "@fontsource-variable/inter",
    "easing-gradients",
    "shadcn",
    "shadow-plugin",
    "tailwindcss",
    "tw-animate-css",
  ],
  files: styleFiles.map((file) => ({
    path: `src/styles/${file}`,
    type: "registry:file",
    target: `~/src/styles/${file}`,
  })),
});

items.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(
  join(packageRoot, "registry.json"),
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "erbium",
      homepage: "https://github.com/erbium-app/erbium-ui",
      items,
    },
    null,
    2,
  )}\n`,
);
