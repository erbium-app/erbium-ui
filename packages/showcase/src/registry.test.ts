import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
import { registryItemSchema } from "shadcn/schema";
import manifest from "../manifest.json";
import uiRegistry from "../../ui/registry.json";
import registry from "../registry.json";

const names = new Set(registry.items.map((item) => item.name));
const uiNames = new Set(uiRegistry.items.map((item) => item.name));
it.each(registry.items)("$name is a complete installable registry item", ({ name }) => {
  const item = registryItemSchema.parse(
    JSON.parse(
      readFileSync(fileURLToPath(new URL(`../public/r/${name}.json`, import.meta.url)), "utf8"),
    ),
  );
  for (const dependency of item.registryDependencies ?? []) {
    const [namespace, dependencyName] = dependency.split("/");
    expect(namespace === "@erbium" ? uiNames.has(dependencyName) : names.has(dependencyName)).toBe(
      true,
    );
  }
  const files = new Set(item.files?.map((file) => file.path));
  for (const file of item.files ?? []) {
    expect(file.target).toMatch(/^@components\/showcase\//);
    expect(file.path).not.toMatch(/\/upstream\//);
    expect(file.target).not.toMatch(/\/upstream\//);
    expect(file.content).not.toContain("/examples/upstream/");
    expect(file.content).not.toContain("variantDocumentation(");
    expect(file.content).not.toContain("componentDocumentation(");
    for (const [, specifier] of file.content?.matchAll(
      /(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g,
    ) ?? []) {
      expect(specifier).not.toMatch(/^@erbium\//);
      if (!specifier.startsWith(".")) continue;
      const base = posix.normalize(posix.join(posix.dirname(file.path), specifier));
      expect(
        [
          base,
          `${base}.tsx`,
          `${base}.ts`,
          `${base}.json`,
          `${base}/index.tsx`,
          `${base}/index.ts`,
        ].some((path) => files.has(path)),
      ).toBe(true);
    }
  }
});
it.each(manifest)(
  "$name exposes every variant, its collection, and portable stories",
  ({ name, variants }) => {
    for (const variant of variants) expect(names.has(`${name}-${variant.slug}`)).toBe(true);
    expect(names.has(`${name}-examples`)).toBe(true);
    expect(names.has(`${name}-stories`)).toBe(true);
  },
);
