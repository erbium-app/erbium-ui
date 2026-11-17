import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import workspaceJson from "../../../package.json" with { type: "json" };
import uiRegistry from "../../ui/registry.json" with { type: "json" };
import manifest from "../manifest.json" with { type: "json" };
import packageJson from "../package.json" with { type: "json" };

/** @typedef {{ content: string, path: string, target: string, type: string }} RegistryFile */

/**
 * @typedef {object} RegistryItem
 * @property {string} name - The item name.
 * @property {string} type - The shadcn registry item type.
 * @property {string} title - The display title.
 * @property {string} description - The item description.
 * @property {string[]} [dependencies] - npm packages with versions.
 * @property {string[]} [devDependencies] - npm development packages with versions.
 * @property {string[]} registryDependencies - Registry items the item installs first.
 * @property {RegistryFile[]} [files] - The item's files.
 */

/** @typedef {[string, RegistryItem]} NamedItem */
/** @typedef {(typeof manifest)[number]} Catalog */

const root = path.dirname(import.meta.dirname);
const sourceRoot = path.join(root, "src");
const check = process.argv.includes("--check");
const showcaseDependencies = new Map(Object.entries(packageJson.dependencies));
const defaultCatalog = new Map(Object.entries(workspaceJson.workspaces.catalog));

const namedCatalogs = new Map(
  Object.entries(workspaceJson.workspaces.catalogs).map(([name, catalog]) => [
    name,
    new Map(Object.entries(catalog)),
  ]),
);

const importSpecifier = /(?:from\s*|import\s*(?:\(\s*)?)["'](?<specifier>[^"']+)["']/gu;
const uiSpecifier = /@erbium\/ui\/(?:components|blocks|charts|hooks|lib)\/[\w-]+/gu;
const frontmatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n/u;
const localTypesImport = /import type \{ Meta, StoryObj \} from "\.\.\/types";/u;
const markdownImport = /import[^;]*from "@erbium\/content\/markdown";\s*/gu;
const rawImports = /import \w+ from "[^"\n]+\?raw";/gu;
const rawImport = /^import (?<binding>\w+) from "(?<source>[^"\n]+)\?raw";$/u;
const defaultExport = /export default meta;/u;
const localSuffixes = ["", ".tsx", ".ts", ".json", "/index.tsx", "/index.ts"];
const runtimeImports = new Set(["react", "react/jsx-runtime"]);

/** @type {Map<string, string>} */
const virtual = new Map();

const uiNames = new Set(uiRegistry.items.map((item) => item.name));

/**
 * @param {string} left - The first string.
 * @param {string} right - The second string.
 * @returns {number} The locale order of the two strings.
 */
const compareLocale = (left, right) => left.localeCompare(right);

/**
 * @param {string} name - The item name.
 * @param {RegistryItem} item - The registry item.
 * @returns {NamedItem} The pair, ready for a Map.
 */
const named = (name, item) => [name, item];

/**
 * Resolves a showcase dependency to the version range it declares, following
 * workspace catalog references.
 * @param {string} name - The npm package name.
 * @returns {string} The version range.
 */
const dependencyVersion = (name) => {
  const version = showcaseDependencies.get(name);

  if (version === undefined || version === "") {
    throw new Error(`Undeclared showcase dependency: ${name}`);
  }

  if (!version.startsWith("catalog:")) {
    return version;
  }

  const catalogName = version.slice("catalog:".length);
  const catalog = catalogName === "" ? defaultCatalog : namedCatalogs.get(catalogName);
  const resolved = catalog?.get(name);

  if (resolved === undefined || resolved === "") {
    throw new Error(`Missing workspace catalog version: ${name} (${version})`);
  }

  return resolved;
};

/**
 * @param {string} source - Module source text.
 * @returns {string[]} The static and dynamic import specifiers, in source order.
 */
const imports = (source) =>
  [...source.matchAll(importSpecifier)].flatMap((match) => match.groups?.specifier ?? []);

/**
 * Writes a JSON file, or in check mode verifies that it already holds the value.
 * @param {string} file - The destination path.
 * @param {unknown} value - The JSON value.
 * @returns {Promise<void>} Settles once written or verified.
 */
const output = async (file, value) => {
  const content = `${JSON.stringify(value, null, 2)}\n`;

  if (check) {
    const actual = await readFile(file, "utf-8").catch(() => "null");

    /** @type {unknown} */
    const parsed = JSON.parse(actual);

    if (JSON.stringify(parsed) !== JSON.stringify(value)) {
      throw new Error(`Registry is stale: ${file}`);
    }
  } else {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
};

/**
 * @param {string} file - A source path.
 * @returns {Promise<string>} The generated text for virtual files, or the file on disk.
 */
const sourceAt = async (file) => virtual.get(file) ?? (await readFile(file, "utf-8"));

/**
 * @param {string} file - A file path.
 * @returns {Promise<boolean>} Whether the path is virtual or readable on disk.
 */
const exists = async (file) => {
  if (virtual.has(file)) {
    return true;
  }

  try {
    await readFile(file);

    return true;
  } catch {
    return false;
  }
};

/**
 * Resolves a relative import the way the bundler does.
 * @param {string} specifier - The relative import specifier.
 * @param {string} from - The importing file.
 * @returns {Promise<string>} The first existing candidate by suffix order.
 */
const localImport = async (specifier, from) => {
  const [request = ""] = specifier.split("?");
  const base = path.resolve(path.dirname(from), request);
  const candidates = localSuffixes.map((suffix) => base + suffix);
  const found = await Promise.all(candidates.map(async (candidate) => await exists(candidate)));
  const match = candidates.find((_candidate, index) => found[index]);

  if (match === undefined) {
    throw new Error(`Unresolved registry dependency ${specifier} in ${from}`);
  }

  return match;
};

/**
 * @param {string} directory - The UI source directory.
 * @param {string} name - The UI registry item name.
 * @returns {string} The canonical shadcn import path for the item.
 */
const uiImport = (directory, name) => {
  if (!uiNames.has(name)) {
    throw new Error(`Unknown UI registry item: ${name}`);
  }

  const folder = directory === "components" ? "ui" : directory;
  const file = name === "utils" && directory === "lib" ? "erbium-utils" : name;

  return `@/registry/erbium/${folder}/${file}`;
};

/**
 * @param {string} specifier - A bare import specifier.
 * @returns {string} The npm package name, including its scope.
 */
const packageName = (specifier) => {
  const parts = specifier.split("/");

  return (specifier.startsWith("@") ? parts.slice(0, 2) : parts.slice(0, 1)).join("/");
};

/**
 * @param {boolean} story - Whether the item is a portable story file.
 * @param {number} fileCount - How many files the item installs.
 * @returns {string} The registry item type.
 */
const itemType = (story, fileCount) => {
  if (story) {
    return "registry:item";
  }

  return fileCount > 1 ? "registry:block" : "registry:component";
};

/**
 * Builds a registry item from an entry file and every showcase file it imports.
 * @param {string} name - The item name.
 * @param {string} entry - The entry file.
 * @param {string} title - The display title.
 * @param {string} description - The item description.
 * @param {boolean} [story] - Whether the entry is a portable story file.
 * @returns {Promise<RegistryItem>} The registry item.
 */
const itemFor = async (name, entry, title, description, story = false) => {
  /** @type {Map<string, string>} */
  const files = new Map();

  /** @type {Set<string>} */
  const seen = new Set();

  /** @type {Set<string>} */
  const dependencies = new Set();

  const registryDependencies = new Set(["@erbium/styles"]);

  /**
   * Adds one file and, recursively, its local imports. Each path is claimed
   * before the first await, so concurrent branches never process it twice.
   * @param {string} file - The file to add.
   * @returns {Promise<void>} Settles once the file and its imports are added.
   */
  const collect = async (file) => {
    if (seen.has(file)) {
      return;
    }

    seen.add(file);

    if (!file.startsWith(`${sourceRoot}/`)) {
      throw new Error(`Example depends on an application file: ${file}`);
    }

    const source = await sourceAt(file);

    const rewritten = source.replaceAll(uiSpecifier, (specifier) => {
      const [directory = "", item = ""] = specifier.split("/").slice(2);
      registryDependencies.add(`@erbium/${item}`);

      return uiImport(directory, item);
    });

    if (imports(rewritten).some((specifier) => specifier.startsWith("@erbium/"))) {
      throw new Error(`Workspace import leaked into registry: ${file}`);
    }

    files.set(file, rewritten);
    const specifiers = imports(source);

    for (const specifier of specifiers) {
      if (
        specifier.startsWith(".") ||
        specifier.startsWith("@erbium/ui/") ||
        runtimeImports.has(specifier)
      ) {
        continue;
      }

      const dependency = packageName(specifier);

      if (!dependency.startsWith("@storybook/")) {
        dependencies.add(`${dependency}@${dependencyVersion(dependency)}`);
      }
    }

    await Promise.all(
      specifiers.map(async (specifier) => {
        if (specifier.startsWith(".")) {
          await collect(await localImport(specifier, file));
        }
      }),
    );
  };

  await collect(entry);

  /** @type {Omit<RegistryItem, "registryDependencies" | "files">} */
  const head = { name, type: itemType(story, files.size), title, description };

  if (dependencies.size > 0) {
    head.dependencies = [...dependencies].toSorted(compareLocale);
  }

  if (story) {
    head.devDependencies = [
      "@storybook/react@^10.6.1",
      ...(name === "toast-stories" ? ["@storybook/addon-docs@^10.6.1"] : []),
    ];
  }

  return {
    ...head,
    registryDependencies: [...registryDependencies].toSorted(compareLocale),
    files: [...files]
      .toSorted(([left], [right]) => compareLocale(left, right))
      .map(([file, content]) => ({
        content,
        path: path.relative(root, file),
        target: `@components/showcase/${path.relative(sourceRoot, file)}`,
        type: story && file.endsWith(".stories.tsx") ? "registry:file" : "registry:component",
      })),
  };
};

/**
 * @param {string} text - Markdown with optional frontmatter.
 * @returns {string} The trimmed body.
 */
const markdownBody = (text) => text.replace(frontmatter, "").trim();

/**
 * @param {string} catalogName - The component catalog name.
 * @param {string} slug - The variant slug, or "index" for the component page.
 * @returns {Promise<string>} The Markdown body of the component copy.
 */
const componentCopy = async (catalogName, slug) =>
  markdownBody(
    await readFile(path.join(root, "../content/components", catalogName, `${slug}.md`), "utf-8"),
  );

/**
 * @param {string} catalogName - The component catalog name.
 * @returns {Promise<string>} The API reference Markdown, or "" when there is none.
 */
const referenceCopy = async (catalogName) => {
  try {
    return await readFile(path.join(root, "../content/references", `${catalogName}.md`), "utf-8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "";
    }

    throw error;
  }
};

/**
 * Replaces each Vite raw import with a constant holding the virtual source.
 * @param {string} source - Catalog source text.
 * @param {string} componentPath - The catalog directory.
 * @returns {string} The source without raw imports.
 */
const inlineRawImports = (source, componentPath) =>
  source.replaceAll(rawImports, (statement) => {
    const { binding = "", source: request = "" } = rawImport.exec(statement)?.groups ?? {};
    const file = path.resolve(componentPath, request);

    return `const ${binding} = ${JSON.stringify(virtual.get(file) ?? "")};`;
  });

/**
 * Builds every registry item for one catalog: its variants, its portable CSF
 * stories file, and an item that installs all of its examples.
 * @param {Catalog} catalog - A showcase manifest catalog.
 * @returns {Promise<NamedItem[]>} Named items in manifest order.
 */
const catalogItems = async (catalog) => {
  const componentPath = path.join(sourceRoot, catalog.name);
  const catalogTitle = catalog.title.split("/").at(-1) ?? "";

  const [variantCopies, variantSources, catalogSource, pageCopy, reference] = await Promise.all([
    Promise.all(
      catalog.variants.map(async (variant) => await componentCopy(catalog.name, variant.slug)),
    ),
    Promise.all(
      catalog.variants.map(
        async (variant) => await readFile(path.join(root, variant.source), "utf-8"),
      ),
    ),
    readFile(path.join(componentPath, "catalog.tsx"), "utf-8"),
    componentCopy(catalog.name, "index"),
    referenceCopy(catalog.name),
  ]);

  const variantItems = await Promise.all(
    catalog.variants.map(async (variant, index) => {
      const name = `${catalog.name}-${variant.slug}`;

      const item = await itemFor(
        name,
        path.join(root, variant.source),
        `${catalogTitle}: ${variant.title}`,
        variantCopies[index] ?? "",
      );

      return named(name, item);
    }),
  );

  // Standalone CSF uses the same examples, args, controls and copy.
  let portable = catalogSource.replace(
    localTypesImport,
    'import type { Meta, StoryObj } from "@storybook/react";',
  );

  portable = portable.replaceAll(markdownImport, "");
  portable = inlineRawImports(portable, componentPath);

  // Fill source constants from the canonical files without a Vite-specific raw import.
  for (const [index, variant] of catalog.variants.entries()) {
    portable = portable.replace(
      `const ${variant.exportName}Source = "";`,
      `const ${variant.exportName}Source = ${JSON.stringify(variantSources[index] ?? "")};`,
    );

    portable = portable.replace(
      `variantDocumentation("${catalog.name}", "${variant.slug}")`,
      JSON.stringify(variantCopies[index] ?? ""),
    );
  }

  const copy = [pageCopy, reference.trim()].filter((part) => part !== "").join("\n\n");

  portable = portable.replaceAll(`componentDocumentation("${catalog.name}")`, JSON.stringify(copy));
  const toast = catalog.name === "toast";

  const toastParameters = toast
    ? "parameters: { ...meta.parameters, docs: { ...meta.parameters.docs, container: ToastDocsContainer } },"
    : "";

  portable = portable.replace(
    defaultExport,
    `export default { ...meta, title: ${JSON.stringify(catalog.title)}, ${toastParameters} decorators: [(Story, context) => <ShowcaseProviders toast={${toast} && context.viewMode !== "docs"}><ShowcaseSurface><Story /></ShowcaseSurface></ShowcaseProviders>] } satisfies Meta;`,
  );

  const toastDocs = toast
    ? 'import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";\nimport type { PropsWithChildren } from "react";\nfunction ToastDocsContainer(props: PropsWithChildren<DocsContainerProps>) { return <DocsContainer {...props}><ShowcaseProviders toast>{props.children}</ShowcaseProviders></DocsContainer>; }\n'
    : "";

  portable = `// Generated from the Erbium showcase catalog and shared Markdown.\nimport { ShowcaseProviders, ShowcaseSurface } from "../preview";\n${toastDocs}${portable}`;
  const storyPath = path.join(componentPath, `${catalog.name}.stories.tsx`);
  virtual.set(storyPath, portable);
  const storiesName = `${catalog.name}-stories`;

  const storiesItem = await itemFor(
    storiesName,
    storyPath,
    `${catalogTitle} stories`,
    `All ${catalog.name} variants as portable React CSF stories.`,
    true,
  );

  /** @type {RegistryItem} */
  const examplesItem = {
    description: `All ${catalog.name} examples.`,
    name: `${catalog.name}-examples`,
    registryDependencies: catalog.variants.map(
      (variant) => `@erbium-examples/${catalog.name}-${variant.slug}`,
    ),
    title: `${catalogTitle} examples`,
    type: "registry:item",
  };

  return [...variantItems, named(storiesName, storiesItem), named(examplesItem.name, examplesItem)];
};

/**
 * @param {string} directory - A directory.
 * @returns {Promise<string[]>} Every file path below it, in directory order.
 */
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const file = path.join(directory, entry.name);

      return entry.isDirectory() ? await walk(file) : [file];
    }),
  );

  return nested.flat();
};

/**
 * @param {string} name - The example name.
 * @param {string} file - The example file.
 * @returns {Promise<NamedItem>} The standalone example item.
 */
const standaloneItem = async (name, file) => {
  const label = name.replaceAll("-", " ");

  return named(name, await itemFor(name, file, label, `Erbium ${label} example.`));
};

// Catalogs only share the virtual map through their own stories file, so they
// build in parallel. Items are inserted in manifest order, as before.
const catalogEntries = await Promise.all(
  manifest.map(async (catalog) => await catalogItems(catalog)),
);

/** @type {Map<string, RegistryItem>} */
const items = new Map(catalogEntries.flat());

// Standalone examples use globally unique component/scenario names.
/** @type {Map<string, string>} */
const standaloneSources = new Map();

for (const file of await walk(sourceRoot)) {
  if (!file.includes("/examples/") || path.extname(file) !== ".tsx" || file.endsWith(".test.tsx")) {
    continue;
  }

  const name = (file.split("/").at(-1) ?? "").slice(0, -4);
  const existing = standaloneSources.get(name);

  if (existing !== undefined) {
    throw new Error(`Ambiguous standalone example ${name}: ${existing} and ${file}`);
  }

  standaloneSources.set(name, file);
}

const standaloneItems = await Promise.all(
  [...standaloneSources].flatMap(([name, file]) =>
    items.has(name) ? [] : [standaloneItem(name, file)],
  ),
);

for (const [name, item] of standaloneItems) {
  items.set(name, item);
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  homepage: "https://github.com/erbium-app/erbium-ui",
  items: [...items.values()].toSorted((left, right) => compareLocale(left.name, right.name)),
  name: "erbium-examples",
};

await output(path.join(root, "registry.json"), {
  ...registry,
  items: registry.items.map((item) => ({
    ...item,
    files: item.files?.map(({ content: _content, ...file }) => file),
  })),
});

await Promise.all(
  registry.items.map(async (item) => {
    await output(path.join(root, "public/r", `${item.name}.json`), {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
    });
  }),
);

await output(path.join(root, "public/r/registry.json"), registry);

process.stdout.write(
  `${check ? "Verified" : "Built"} ${registry.items.length} installable showcase registry items.\n`,
);

if (!check) {
  execFileSync(
    "vp",
    ["fmt", "packages/showcase/registry.json", "packages/showcase/public/r", "--write"],
    { cwd: path.join(root, "../.."), stdio: "pipe" },
  );
}

const publicDirectory = path.join(root, "public/r");

const expectedFiles = new Set([
  "registry.json",
  ...registry.items.map((item) => `${item.name}.json`),
]);

const publicFiles = await readdir(publicDirectory);
const orphans = publicFiles.filter((file) => file.endsWith(".json") && !expectedFiles.has(file));
const [firstOrphan] = orphans;

if (check && firstOrphan !== undefined) {
  throw new Error(`Orphaned registry item: ${firstOrphan}`);
}

await Promise.all(
  orphans.map(async (file) => {
    await unlink(path.join(publicDirectory, file));
  }),
);
