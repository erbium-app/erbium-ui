import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const componentsDir = join(root, "src/components");
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const dependencyNames = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const packageName = (specifier) => {
  if (!specifier.startsWith("@")) return specifier.split("/")[0];
  return specifier.split("/").slice(0, 2).join("/");
};

const getImports = (source) =>
  [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);

const files = (await readdir(componentsDir)).filter((file) => file.endsWith(".tsx")).sort();
const items = [
  {
    name: "utils",
    type: "registry:lib",
    title: "Class name utility",
    description: "The Erbium class name merge utility.",
    dependencies: ["cn"],
    files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
  },
];

for (const file of files) {
  const source = await readFile(join(componentsDir, file), "utf8");
  const registryDependencies = new Set();
  const dependencies = new Set();

  for (const specifier of getImports(source)) {
    if (specifier === "../lib/utils") registryDependencies.add("utils");
    if (specifier.startsWith("./")) registryDependencies.add(specifier.slice(2));
    if (!specifier.startsWith(".") && dependencyNames.has(packageName(specifier))) {
      dependencies.add(packageName(specifier));
    }
  }

  const name = file.replace(/\.tsx$/, "");
  items.push({
    name,
    type: "registry:ui",
    title: name.replace(/(^|-)(\w)/g, (_, __, character) => ` ${character.toUpperCase()}`).trim(),
    description: `Erbium ${name} component.`,
    ...(dependencies.size
      ? { dependencies: [...dependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    ...(registryDependencies.size
      ? { registryDependencies: [...registryDependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    files: [{ path: `src/components/${file}`, type: "registry:ui" }],
  });
}

await writeFile(
  join(root, "registry.json"),
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
