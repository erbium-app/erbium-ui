import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const examples = join(root, "src/examples");
const registryExamples = join(root, "registry/examples");
const items = [];
await rm(registryExamples, { recursive: true, force: true });
await rm(join(root, "public/r"), { recursive: true, force: true });
await mkdir(registryExamples, { recursive: true });

for (const file of (await readdir(examples)).filter((name) => name.endsWith(".tsx")).sort()) {
  const name = file.slice(0, -4);
  const source = await readFile(join(examples, file), "utf8");
  const registryDependencies = new Set();
  const dependencies = new Set();
  const rewritten = source.replace(
    /@erbium\/ui\/(components|hooks|lib)\/([\w-]+)/g,
    (_, directory, item) => {
      registryDependencies.add(`@erbium/${item}`);
      return `../${directory}/${item}`;
    },
  );
  for (const [, specifier] of rewritten.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
    if (!specifier.startsWith(".") && specifier !== "react" && specifier !== "react/jsx-runtime") {
      dependencies.add(
        specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0],
      );
    }
  }
  // These generated files resolve component imports only after the CLI installs their registry dependencies.
  await writeFile(join(registryExamples, file), `// @ts-nocheck\n${rewritten}`);
  items.push({
    name,
    type: "registry:component",
    title: name.replace(/(^|-)(\w)/g, (_, __, letter) => ` ${letter.toUpperCase()}`).trim(),
    description: `Erbium ${name.replaceAll("-", " ")} example.`,
    ...(dependencies.size
      ? { dependencies: [...dependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    ...(registryDependencies.size
      ? { registryDependencies: [...registryDependencies].sort((a, b) => a.localeCompare(b)) }
      : {}),
    files: [
      {
        path: `registry/examples/${file}`,
        type: "registry:component",
        target: `~/src/examples/${file}`,
      },
    ],
  });
}
await writeFile(
  join(root, "registry.json"),
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "erbium-examples",
      homepage: "https://github.com/erbium-app/erbium-ui",
      items,
    },
    null,
    2,
  )}\n`,
);
