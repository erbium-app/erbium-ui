import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const check = process.argv.includes("--check");
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const uiRegistry = JSON.parse(await readFile(join(root, "../ui/registry.json"), "utf8"));
const uiNames = new Set(uiRegistry.items.map((item) => item.name));
const virtual = new Map();
const imports = (source) =>
  [...source.matchAll(/(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g)].map((match) => match[1]);
async function output(path, value) {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (check) {
    const actual = await readFile(path, "utf8").catch(() => "null");
    if (JSON.stringify(JSON.parse(actual)) !== JSON.stringify(value))
      throw new Error(`Registry is stale: ${path}`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}
async function sourceAt(path) {
  return virtual.get(path) ?? (await readFile(path, "utf8"));
}
async function localImport(specifier, from) {
  const base = resolve(dirname(from), specifier.split("?")[0]);
  for (const suffix of ["", ".tsx", ".ts", ".json", "/index.tsx", "/index.ts"]) {
    const path = base + suffix;
    if (virtual.has(path)) return path;
    try {
      await readFile(path);
      return path;
    } catch {
      /* Try the next extension. */
    }
  }
  throw new Error(`Unresolved registry dependency ${specifier} in ${from}`);
}
function uiImport(directory, name) {
  if (!uiNames.has(name)) throw new Error(`Unknown UI registry item: ${name}`);
  return `@/registry/erbium/${directory === "components" ? "ui" : directory}/${name === "utils" && directory === "lib" ? "erbium-utils" : name}`;
}
async function itemFor(name, entry, title, description, story = false) {
  const files = new Map(),
    dependencies = new Set(),
    registryDependencies = new Set(["@erbium/styles"]);
  async function collect(path) {
    if (files.has(path)) return;
    if (!path.startsWith(join(root, "src") + "/"))
      throw new Error(`Example depends on an application file: ${path}`);
    const source = await sourceAt(path);
    const rewritten = source.replace(
      /@erbium\/ui\/(components|hooks|lib)\/([\w-]+)/g,
      (_, directory, item) => {
        registryDependencies.add(`@erbium/${item}`);
        return uiImport(directory, item);
      },
    );
    if (imports(rewritten).some((specifier) => specifier.startsWith("@erbium/")))
      throw new Error(`Workspace import leaked into registry: ${path}`);
    files.set(path, rewritten);
    for (const specifier of imports(source)) {
      if (specifier.startsWith(".")) await collect(await localImport(specifier, path));
      else if (
        !specifier.startsWith("@erbium/ui/") &&
        !["react", "react/jsx-runtime"].includes(specifier)
      ) {
        const dependency = specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0];
        if (!dependency.startsWith("@storybook/")) {
          const version = packageJson.dependencies[dependency];
          if (!version) throw new Error(`Undeclared showcase dependency: ${dependency}`);
          dependencies.add(`${dependency}@${version}`);
        }
      }
    }
  }
  await collect(entry);
  return {
    name,
    type: story ? "registry:item" : files.size > 1 ? "registry:block" : "registry:component",
    title,
    description,
    ...(dependencies.size
      ? { dependencies: [...dependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    ...(story
      ? {
          devDependencies: [
            "@storybook/react@^10.6.1",
            ...(name === "toast-stories" ? ["@storybook/addon-docs@^10.6.1"] : []),
          ],
        }
      : {}),
    registryDependencies: [...registryDependencies].sort((a, b) => a.localeCompare(b)),
    files: [...files]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => ({
        path: relative(root, path),
        type: story && path.endsWith(".stories.tsx") ? "registry:file" : "registry:component",
        target: `@components/showcase/${relative(join(root, "src"), path)}`,
        content,
      })),
  };
}
function markdownBody(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}
const items = new Map();
for (const catalog of manifest) {
  const componentPath = join(root, "src", catalog.name);
  for (const variant of catalog.variants) {
    const copy = markdownBody(
      await readFile(
        join(root, "../content/components", catalog.name, `${variant.slug}.md`),
        "utf8",
      ),
    );
    const name = `${catalog.name}-${variant.slug}`;
    items.set(
      name,
      await itemFor(
        name,
        join(root, variant.source),
        `${catalog.title.split("/").at(-1)}: ${variant.title}`,
        copy,
      ),
    );
  }
  // Standalone CSF uses the same examples, args, controls, copy and browser tests.
  let portable = await readFile(join(componentPath, "catalog.tsx"), "utf8");
  portable = portable.replace(
    /import type \{ Meta, StoryObj \} from "\.\.\/types";/,
    'import type { Meta, StoryObj } from "@storybook/react";',
  );
  portable = portable.replace(/import[^;]*from "@erbium\/content\/markdown";\s*/g, "");
  portable = portable.replace(/import (\w+) from "([^"\n]+)\?raw";/g, (_, binding, source) => {
    const path = resolve(componentPath, source);
    return `const ${binding} = ${JSON.stringify(virtual.get(path) ?? "")};`;
  });
  // Fill source constants from the canonical files without a Vite-specific raw import.
  for (const variant of catalog.variants) {
    const source = await readFile(join(root, variant.source), "utf8");
    portable = portable.replace(
      `const ${variant.exportName}Source = "";`,
      `const ${variant.exportName}Source = ${JSON.stringify(source)};`,
    );
    const copy = markdownBody(
      await readFile(
        join(root, "../content/components", catalog.name, `${variant.slug}.md`),
        "utf8",
      ),
    );
    portable = portable.replace(
      `variantDocumentation("${catalog.name}", "${variant.slug}")`,
      JSON.stringify(copy),
    );
  }
  const referenceCopy = await readFile(
    join(root, "../content/references", `${catalog.name}.md`),
    "utf8",
  ).catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const copy = [
    markdownBody(
      await readFile(join(root, "../content/components", catalog.name, "index.md"), "utf8"),
    ),
    referenceCopy.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
  portable = portable.replaceAll(`componentDocumentation("${catalog.name}")`, JSON.stringify(copy));
  const toast = catalog.name === "toast";
  portable = portable.replace(
    /export default meta;/,
    `export default { ...meta, ${toast ? "parameters: { ...meta.parameters, docs: { ...meta.parameters.docs, container: ToastDocsContainer } }," : ""} decorators: [(Story, context) => <ShowcaseProviders toast={${toast} && context.viewMode !== "docs"}><ShowcaseSurface><Story /></ShowcaseSurface></ShowcaseProviders>] } satisfies Meta;`,
  );
  const toastDocs = toast
    ? 'import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";\nimport type { PropsWithChildren } from "react";\nfunction ToastDocsContainer(props: PropsWithChildren<DocsContainerProps>) { return <DocsContainer {...props}><ShowcaseProviders toast>{props.children}</ShowcaseProviders></DocsContainer>; }\n'
    : "";
  portable = `// Generated from the Erbium showcase catalog and shared Markdown.\nimport { ShowcaseProviders, ShowcaseSurface } from "../preview";\n${toastDocs}${portable}`;
  const storyPath = join(componentPath, `${catalog.name}.stories.tsx`);
  virtual.set(storyPath, portable);
  items.set(
    `${catalog.name}-stories`,
    await itemFor(
      `${catalog.name}-stories`,
      storyPath,
      `${catalog.title.split("/").at(-1)} stories`,
      `All ${catalog.name} variants as portable React CSF stories.`,
      true,
    ),
  );
  items.set(`${catalog.name}-examples`, {
    name: `${catalog.name}-examples`,
    type: "registry:item",
    title: `${catalog.title.split("/").at(-1)} examples`,
    description: `All ${catalog.name} examples.`,
    registryDependencies: catalog.variants.map(
      (variant) => `@erbium-examples/${catalog.name}-${variant.slug}`,
    ),
  });
}
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name),
      ),
    )
  ).flat();
}
// Preserve the public names of the original standalone examples, including nested helpers.
for (const path of await walk(join(root, "src"))) {
  if (!path.includes("/examples/") || extname(path) !== ".tsx" || path.endsWith(".test.tsx"))
    continue;
  const name = path.split("/").at(-1).slice(0, -4);
  if (!items.has(name))
    items.set(
      name,
      await itemFor(
        name,
        path,
        name.replaceAll("-", " "),
        `Erbium ${name.replaceAll("-", " ")} example.`,
      ),
    );
}
const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "erbium-examples",
  homepage: "https://github.com/erbium-app/erbium-ui",
  items: [...items.values()].sort((a, b) => a.name.localeCompare(b.name)),
};
await output(join(root, "registry.json"), {
  ...registry,
  items: registry.items.map((item) => ({
    ...item,
    files: item.files?.map(({ content: _content, ...file }) => file),
  })),
});
for (const item of registry.items)
  await output(join(root, "public/r", `${item.name}.json`), {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
  });
await output(join(root, "public/r/registry.json"), registry);
console.log(
  `${check ? "Verified" : "Built"} ${registry.items.length} installable showcase registry items.`,
);

if (!check)
  await promisify(execFile)(
    "vp",
    ["fmt", "packages/showcase/registry.json", "packages/showcase/public/r", "--write"],
    { cwd: join(root, "../..") },
  );

const publicDirectory = join(root, "public/r");
const expectedFiles = new Set([
  "registry.json",
  ...registry.items.map((item) => `${item.name}.json`),
]);
for (const file of await readdir(publicDirectory)) {
  if (!file.endsWith(".json") || expectedFiles.has(file)) continue;
  if (check) throw new Error(`Orphaned registry item: ${file}`);
  await unlink(join(publicDirectory, file));
}
