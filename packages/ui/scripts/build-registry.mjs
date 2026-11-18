import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/** @typedef {"registry:ui" | "registry:block" | "registry:component" | "registry:hook" | "registry:lib"} SourceType */
/** @typedef {{ path: string, target: string, type: string }} RegistryFile */

/**
 * @typedef {object} RegistryItem
 * @property {string} name - The item name.
 * @property {string} type - The shadcn registry item type.
 * @property {string} title - The display title.
 * @property {string} description - The item description.
 * @property {string[]} [dependencies] - npm packages the item imports.
 * @property {string[]} [registryDependencies] - Registry items the item imports.
 * @property {RegistryFile[]} files - The item's source files.
 */

const packageRoot = path.dirname(import.meta.dirname);
const sourceRoot = path.join(packageRoot, "src");

/**
 * @param {unknown} value - A parsed JSON value.
 * @param {string} key - A property name.
 * @returns {string[]} The keys of the object at that property, or none.
 */
const keysAt = (value, key) => {
  if (!(value instanceof Object)) {
    return [];
  }

  /** @type {[string, unknown][]} */
  const fields = Object.entries(value);
  const field = fields.find(([name]) => name === key)?.[1];

  return field instanceof Object ? Object.keys(field) : [];
};

/** @type {unknown} */
const packageJson = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf-8"));

const dependencies = new Set([
  ...keysAt(packageJson, "dependencies"),
  ...keysAt(packageJson, "peerDependencies"),
]);

/**
 * @param {unknown} value - A parsed package.json.
 * @returns {string} Its version.
 */
const versionOf = (value) => {
  if (!(value instanceof Object)) {
    throw new TypeError("A workspace package.json must be an object.");
  }

  /** @type {[string, unknown][]} */
  const fields = Object.entries(value);
  const version = fields.find(([name]) => name === "version")?.[1];

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- this is the I/O boundary: it parses a package.json read from disk.
  if (typeof version !== "string") {
    throw new TypeError("A published workspace package needs a version.");
  }

  return version;
};

/*
 * Workspace packages that are published to npm. packages/ui depends on them as `workspace:*`,
 * which means nothing outside the monorepo, so registry items name them with the range of the
 * version this registry was built against.
 */
const publishedWorkspacePackages = new Map(
  await Promise.all(
    [["@erbium-ui/react", "../react/package.json"]].map(async ([name, manifest]) => {
      /** @type {unknown} */
      const workspacePackage = JSON.parse(
        await readFile(path.join(packageRoot, manifest), "utf-8"),
      );

      /** @type {[string, string]} */
      const entry = [name, `${name}@^${versionOf(workspacePackage)}`];

      return entry;
    }),
  ),
);

/**
 * @param {string} name - An npm package an item imports.
 * @returns {string} The name, or a name with a version range for a published workspace package.
 */
const dependencySpec = (name) => publishedWorkspacePackages.get(name) ?? name;

const sourceExtensions = [".tsx", ".ts", ".jsx", ".js", ".css"];
const scriptExtensions = new Set([".ts", ".tsx"]);
const titleWord = /(?:^|-)\w/gu;
const importSpecifier = /(?:from\s*|import\s*)["'](?<specifier>[^"']+)["']/gu;
const fontUrl = /url\("(?<file>\.\.\/assets\/fonts\/[^" ]+\.woff2)"\)/gu;
const scriptExtension = /\.(?:tsx|ts)$/u;
const componentsDirectory = /^components\//u;
const statefulPrefix = /^stateful\/stateful-/u;

/** @type {Record<string, SourceType>} */
const typeByDirectory = {
  blocks: "registry:block",
  charts: "registry:component",
  components: "registry:ui",
  hooks: "registry:hook",
};

/** @type {Record<string, string>} */
const targetByType = {
  "registry:block": "@components/blocks",
  "registry:component": "@components/charts",
  "registry:hook": "@hooks",
  "registry:ui": "@ui",
};

/**
 * Orders strings by code unit, as Array#sort does without a comparator.
 * @param {string} left - The first string.
 * @param {string} right - The second string.
 * @returns {number} A negative, zero, or positive sort order.
 */
const compareCodeUnits = (left, right) => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

/**
 * @param {string} left - The first string.
 * @param {string} right - The second string.
 * @returns {number} The locale order of the two strings.
 */
const compareLocale = (left, right) => left.localeCompare(right);

/**
 * @param {string} specifier - A bare import specifier.
 * @returns {string} The npm package name, including its scope.
 */
const packageName = (specifier) => {
  const parts = specifier.split("/");

  return (specifier.startsWith("@") ? parts.slice(0, 2) : parts.slice(0, 1)).join("/");
};

/**
 * @param {string} name - A kebab-case item name.
 * @returns {string} The name in title case.
 */
const title = (name) =>
  name.replaceAll(titleWord, (match) => ` ${match.at(-1)?.toUpperCase() ?? ""}`).trim();

/**
 * @param {string} source - Module source text.
 * @returns {string[]} The import specifiers, in source order.
 */
const readImports = (source) =>
  [...source.matchAll(importSpecifier)].flatMap((match) => match.groups?.specifier ?? []);

/**
 * @param {string} file - A file path.
 * @returns {Promise<boolean>} Whether the path exists and is a file.
 */
const isFile = async (file) => {
  try {
    const stats = await stat(file);

    return stats.isFile();
  } catch {
    return false;
  }
};

/**
 * Resolves a relative import to a source file the way the bundler does.
 * @param {string} specifier - The import specifier.
 * @param {string} sourceFile - The importing file.
 * @returns {Promise<string | undefined>} The first existing file by extension order.
 */
const getInternalItem = async (specifier, sourceFile) => {
  const basePath = path.resolve(path.dirname(sourceFile), specifier);

  const candidates = specifier.startsWith(".")
    ? sourceExtensions.map((extension) => `${basePath}${extension}`)
    : [];

  const found = await Promise.all(candidates.map(async (candidate) => await isFile(candidate)));

  return candidates.find((_candidate, index) => found[index]);
};

/**
 * @param {string} directory - A directory.
 * @returns {Promise<string[]>} The names of the files directly inside it.
 */
const filesIn = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries.flatMap((entry) => (entry.isDirectory() ? [] : [entry.name]));
};

/**
 * @param {string} directory - A directory.
 * @returns {Promise<string[]>} Every file path below it, in directory order.
 */
const filesInRecursive = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      return entry.isDirectory() ? await filesInRecursive(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
};

/**
 * @param {string} file - A file path or name.
 * @returns {string} The path without its extension.
 */
const withoutExtension = (file) => file.slice(0, -path.extname(file).length);

/** @type {Map<string, string>} */
const itemBySource = new Map();
const componentRoot = path.join(sourceRoot, "components");
const blockRoot = path.join(sourceRoot, "blocks");
const chartRoot = path.join(sourceRoot, "charts");

for (const filePath of await filesInRecursive(componentRoot)) {
  if (scriptExtensions.has(path.extname(filePath))) {
    const name = withoutExtension(path.relative(componentRoot, filePath))
      .replace(statefulPrefix, "stateful/")
      .split(path.sep)
      .join("-");

    itemBySource.set(filePath, name);
  }
}

// Blocks and charts name items by their path inside their own directory.
const namedRoots = [blockRoot, chartRoot];

const namedListings = await Promise.all(
  namedRoots.map(async (root) => await filesInRecursive(root)),
);

for (const [index, root] of namedRoots.entries()) {
  for (const filePath of namedListings[index] ?? []) {
    if (scriptExtensions.has(path.extname(filePath))) {
      itemBySource.set(
        filePath,
        withoutExtension(path.relative(root, filePath)).split(path.sep).join("-"),
      );
    }
  }
}

const flatDirectories = ["hooks", "lib"];

const flatListings = await Promise.all(
  flatDirectories.map(async (directory) => await filesIn(path.join(sourceRoot, directory))),
);

for (const [index, directory] of flatDirectories.entries()) {
  for (const file of flatListings[index] ?? []) {
    if (scriptExtensions.has(path.extname(file))) {
      itemBySource.set(path.join(sourceRoot, directory, file), withoutExtension(file));
    }
  }
}

/**
 * Describes one source file as a registry item.
 * @param {string} sourceFile - The source file path.
 * @param {string} name - The item name.
 * @param {SourceType} type - The registry item type.
 * @returns {Promise<RegistryItem>} The registry item.
 */
const itemFor = async (sourceFile, name, type) => {
  const source = await readFile(sourceFile, "utf-8");
  const specifiers = readImports(source);

  const internalFiles = await Promise.all(
    specifiers.map(async (specifier) => await getInternalItem(specifier, sourceFile)),
  );

  /** @type {Set<string>} */
  const registryDependencies = new Set();

  /** @type {Set<string>} */
  const npmDependencies = new Set();

  for (const [index, specifier] of specifiers.entries()) {
    const internalFile = internalFiles[index];
    const internalName = internalFile === undefined ? undefined : itemBySource.get(internalFile);

    if (internalName !== undefined) {
      registryDependencies.add(`@erbium/${internalName}`);
      continue;
    }

    if (!specifier.startsWith(".") && dependencies.has(packageName(specifier))) {
      npmDependencies.add(dependencySpec(packageName(specifier)));
    }
  }

  const sourcePath = path.relative(packageRoot, sourceFile).split(path.sep).join("/");
  const kind = type === "registry:ui" ? "component" : type.slice("registry:".length);

  /** @type {Omit<RegistryItem, "files">} */
  const head = {
    name,
    type,
    title: title(name),
    description: `Erbium ${name.replaceAll("-", " ")} ${kind}.`,
  };

  if (npmDependencies.size > 0) {
    head.dependencies = [...npmDependencies].toSorted(compareLocale);
  }

  if (registryDependencies.size > 0) {
    head.registryDependencies = [...registryDependencies].toSorted(compareLocale);
  }

  const targetFile =
    name === "utils" ? "erbium-utils.ts" : sourcePath.split("/").slice(2).join("/");

  return {
    ...head,
    files: [{ path: sourcePath, target: `${targetByType[type] ?? "@lib"}/${targetFile}`, type }],
  };
};

const sourceItems = await Promise.all(
  [...itemBySource].map(async ([sourceFile, name]) => {
    const [directory = ""] = path.relative(sourceRoot, path.dirname(sourceFile)).split(path.sep);

    return await itemFor(sourceFile, name, typeByDirectory[directory] ?? "registry:lib");
  }),
);

// Global styles rely on Tailwind v4 and the listed plugins. Preserve the source
// layout so the relative CSS imports continue to work in the consuming project.
const styleDirectoryFiles = await filesIn(path.join(sourceRoot, "styles"));

const styleFiles = styleDirectoryFiles
  .filter((file) => file.endsWith(".css"))
  .toSorted(compareCodeUnits);

// Preserve font licenses in source installations. Binary faces are served separately so
// unicode-range can prevent unused script fonts from downloading.
const fontLicenses = ["OFL.txt", "Vazirmatn-OFL.txt", "PaperMono-OFL.txt"];

/** @type {RegistryItem} */
const stylesItem = {
  dependencies: ["easing-gradients", "shadcn", "shadow-plugin", "tailwindcss", "tw-animate-css"],
  description: "Erbium global styles, theme tokens, fonts, and Tailwind utilities.",
  files: [
    ...styleFiles.map((file) => ({
      path: `src/styles/${file}`,
      target: `~/src/styles/${file}`,
      type: "registry:file",
    })),
    ...fontLicenses.map((file) => ({
      path: `src/assets/fonts/${file}`,
      target: `~/src/assets/fonts/${file}`,
      type: "registry:file",
    })),
  ],
  name: "styles",
  title: "Erbium styles",
  type: "registry:item",
};

const items = [...sourceItems, stylesItem].toSorted((a, b) => compareLocale(a.name, b.name));

await writeFile(
  path.join(packageRoot, "registry.json"),
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

/**
 * Rewrites one registry file for the public registry: font URLs point at the
 * hosted fonts and internal imports use canonical shadcn aliases.
 * @param {RegistryFile} file - A registry file.
 * @returns {Promise<RegistryFile & { content: string }>} The file with its public content.
 */
const publicFile = async (file) => {
  const sourceFile = path.join(packageRoot, file.path);
  let content = await readFile(sourceFile, "utf-8");

  if (file.path === "src/styles/fonts.css") {
    for (const match of content.matchAll(fontUrl)) {
      const [url] = match;
      const fontFile = match.groups?.file.split("/").pop() ?? "";
      content = content.replace(url, `url("https://ui.erbium.app/fonts/${fontFile}")`);
    }
  }

  const specifiers = readImports(content);

  const internals = await Promise.all(
    specifiers.map(async (specifier) => await getInternalItem(specifier, sourceFile)),
  );

  for (const [index, specifier] of specifiers.entries()) {
    const internal = internals[index];

    if (internal === undefined || !itemBySource.has(internal)) {
      continue;
    }

    const local = path
      .relative(sourceRoot, internal)
      .split(path.sep)
      .join("/")
      .replace(scriptExtension, "");

    const canonical = `@/registry/erbium/${local === "lib/utils" ? "lib/erbium-utils" : local.replace(componentsDirectory, "ui/")}`;

    content = content
      .replaceAll(`"${specifier}"`, `"${canonical}"`)
      .replaceAll(`'${specifier}'`, `'${canonical}'`);
  }

  return { ...file, content };
};

// Public source uses canonical shadcn aliases so custom consumer aliases work.
await mkdir(path.join(packageRoot, "public/r"), { recursive: true });

// Every item writes its own file, so items build in parallel; Promise.all keeps
// the sorted order for the public index.
const publicItems = await Promise.all(
  items.map(async (item) => {
    const files = await Promise.all(item.files.map(async (file) => await publicFile(file)));
    const entry = { ...item, files };

    await writeFile(
      path.join(packageRoot, "public/r", `${item.name}.json`),
      `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...entry }, null, 2)}\n`,
    );

    return entry;
  }),
);

await writeFile(
  path.join(packageRoot, "public/r/registry.json"),
  `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", homepage: "https://github.com/erbium-app/erbium-ui", items: publicItems, name: "erbium" }, null, 2)}\n`,
);
