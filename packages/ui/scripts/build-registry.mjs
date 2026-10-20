import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(import.meta.dirname);
const sourceRoot = join(packageRoot, "src");
const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf-8"));

const dependencies = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

const title = (name) =>
  name.replaceAll(/(^|-)(\w)/g, (_, __, character) => ` ${character.toUpperCase()}`).trim();

const readImports = (source) =>
  [...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map((match) => match[1]);

const getInternalItem = async (specifier, sourceFile) => {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const basePath = resolve(dirname(sourceFile), specifier);

  for (const extension of [".tsx", ".ts", ".jsx", ".js", ".css"]) {
    const filePath = `${basePath}${extension}`;

    try {
      if ((await stat(filePath)).isFile()) {
        return filePath;
      }
    } catch {
      // Try the next supported source extension.
    }
  }

  return null;
};

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

for (const filePath of await filesInRecursive(join(sourceRoot, "blocks"))) {
  if ([".ts", ".tsx"].includes(extname(filePath))) {
    itemBySource.set(
      filePath,
      relative(join(sourceRoot, "blocks"), filePath)
        .slice(0, -extname(filePath).length)
        .split(sep)
        .join("-"),
    );
  }
}

for (const file of await filesIn(join(sourceRoot, "hooks"))) {
  if ([".ts", ".tsx"].includes(extname(file))) {
    itemBySource.set(join(sourceRoot, "hooks", file), file.slice(0, -extname(file).length));
  }
}

for (const file of await filesIn(join(sourceRoot, "lib"))) {
  if ([".ts", ".tsx"].includes(extname(file))) {
    itemBySource.set(join(sourceRoot, "lib", file), file.slice(0, -extname(file).length));
  }
}

const itemFor = async (sourceFile, name, type) => {
  const source = await readFile(sourceFile, "utf-8");
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
    files: [
      {
        path: sourcePath,
        target: `${type === "registry:ui" ? "@ui" : type === "registry:hook" ? "@hooks" : type === "registry:block" ? "@components/blocks" : "@lib"}/${name === "utils" ? "erbium-utils.ts" : sourcePath.split("/").slice(2).join("/")}`,
        type,
      },
    ],
  };
};

const items = [];

for (const [sourceFile, name] of itemBySource) {
  const directory = relative(sourceRoot, dirname(sourceFile)).split(sep)[0];

  const type =
    directory === "components"
      ? "registry:ui"
      : directory === "blocks"
        ? "registry:block"
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
  dependencies: ["easing-gradients", "shadcn", "shadow-plugin", "tailwindcss", "tw-animate-css"],
  description: "Erbium global styles, theme tokens, fonts, and Tailwind utilities.",
  files: styleFiles.map((file) => ({
    path: `src/styles/${file}`,
    target: `~/src/styles/${file}`,
    type: "registry:file",
  })),
  name: "styles",
  title: "Erbium styles",
  type: "registry:item",
});

// Preserve font licenses in source installations. Binary faces are served separately so
// unicode-range can prevent unused script fonts from downloading.
items
  .find((item) => item.name === "styles")
  .files.push(
    ...["OFL.txt", "Vazirmatn-OFL.txt", "PaperMono-OFL.txt"].map((file) => ({
      path: `src/assets/fonts/${file}`,
      target: `~/src/assets/fonts/${file}`,
      type: "registry:file",
    })),
  );

items.sort((a, b) => a.name.localeCompare(b.name));

await writeFile(
  join(packageRoot, "registry.json"),
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      homepage: "https://github.com/erbium-app/erbium-ui",
      items,
      name: "erbium",
    },
    null,
    2,
  )}\n`,
);

// Public source uses canonical shadcn aliases so custom consumer aliases work.
await mkdir(join(packageRoot, "public/r"), { recursive: true });

const publicItems = [];

for (const item of items) {
  const files = [];

  for (const file of item.files) {
    const sourceFile = join(packageRoot, file.path);
    let content = await readFile(sourceFile, "utf-8");

    if (file.path === "src/styles/fonts.css") {
      for (const match of content.matchAll(/url\("(\.\.\/assets\/fonts\/[^" ]+\.woff2)"\)/g)) {
        content = content.replace(
          match[0],
          `url("https://ui.erbium.app/fonts/${match[1].split("/").pop()}")`,
        );
      }
    }

    for (const specifier of readImports(content)) {
      const internal = await getInternalItem(specifier, sourceFile);

      if (!internal || !itemBySource.has(internal)) {
        continue;
      }

      const local = relative(sourceRoot, internal)
        .split(sep)
        .join("/")
        .replace(/\.(tsx|ts)$/, "");

      const canonical = `@/registry/erbium/${local === "lib/utils" ? "lib/erbium-utils" : local.replace(/^components\//, "ui/")}`;
      content = content
        .replaceAll(`"${specifier}"`, `"${canonical}"`)
        .replaceAll(`'${specifier}'`, `'${canonical}'`);
    }

    files.push({ ...file, content });
  }

  const entry = { ...item, files };
  publicItems.push(entry);
  await writeFile(
    join(packageRoot, "public/r", `${item.name}.json`),
    `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...entry }, null, 2)}\n`,
  );
}

await writeFile(
  join(packageRoot, "public/r/registry.json"),
  `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", homepage: "https://github.com/erbium-app/erbium-ui", items: publicItems, name: "erbium" }, null, 2)}\n`,
);
