import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import plugin, { typographyViolations } from "./typography-lint.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const docsRequire = createRequire(new URL("../apps/docs/package.json", import.meta.url));
const astroRequire = createRequire(docsRequire.resolve("astro/package.json"));
const { parse } = await import(astroRequire.resolve("@astrojs/compiler-rs"));
let errors = 0;

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

function report(path, source, offset, message) {
  errors += 1;
  const line = source.slice(0, offset).split("\n").length;
  process.stderr.write(`${relative(root, path)}:${line}: ${message}\n`);
}

// Oxlint does not parse Astro. Run the same role rule over Astro's own ESTree
// output instead of relying on regexes over markup or generated JavaScript.
for (const path of sourceFiles(join(root, "apps/docs/src")).filter((file) =>
  file.endsWith(".astro"),
)) {
  const source = readFileSync(path, "utf8");
  const { ast, diagnostics } = parse(source);
  for (const diagnostic of diagnostics.filter((item) => item.severity === "error")) {
    report(path, source, 0, diagnostic.text ?? "Astro parsing failed.");
  }
  const ancestors = new WeakMap();
  const visitors = plugin.rules["use-roles"].create({
    physicalFilename: path,
    sourceCode: { getAncestors: (node) => ancestors.get(node) ?? [] },
    report: ({ node, data }) =>
      report(
        path,
        source,
        node.start,
        `"${data.token ?? data.property}" bypasses Erbium typography. Use a shared text role.`,
      ),
  });
  function walk(node, parents = []) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const child of node) walk(child, parents);
      return;
    }
    ancestors.set(node, parents);
    visitors[node.type]?.(node);
    for (const value of Object.values(node)) walk(value, [...parents, node]);
  }
  walk(ast);
}

// CSS recipes use the same vocabulary; token definitions stay in the shared
// typography stylesheet, while @apply cannot reintroduce a second scale.
for (const directory of [
  "packages/ui/src/styles",
  "apps/docs/src/styles",
  "apps/storybook/src",
  "apps/website/src",
]) {
  for (const path of sourceFiles(join(root, directory)).filter((file) => file.endsWith(".css"))) {
    const source = readFileSync(path, "utf8");
    const tokenDefinitions = path === join(root, "packages/ui/src/styles/typography.css");
    const textPrimitives =
      tokenDefinitions ||
      ["fonts.css", "typeset.css"].some(
        (name) => path === join(root, "packages/ui/src/styles", name),
      );
    const declarations = source.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
      comment.replace(/[^\n]/g, " "),
    );
    if (!textPrimitives) {
      for (const match of declarations.matchAll(
        /(?:^|[;{])\s*(font(?:-size|-family|-weight|-variation-settings)?|line-height|letter-spacing)\s*:/g,
      ))
        report(
          path,
          source,
          match.index,
          `"${match[1]}" belongs in the shared typography stylesheet. Use a text role here.`,
        );
    }
    if (!tokenDefinitions) {
      for (const match of declarations.matchAll(/--text-[a-z-]+\s*:/g))
        report(
          path,
          source,
          match.index,
          "Text role definitions belong in packages/ui/src/styles/typography.css.",
        );
    }
    for (const match of source.matchAll(/@apply\s+([^;]+);/g)) {
      for (const token of typographyViolations(match[1]))
        report(
          path,
          source,
          match.index,
          `"${token}" bypasses Erbium typography. Use a shared text role.`,
        );
    }
  }
}

if (errors) process.exitCode = 1;
else process.stdout.write("Typography roles verified in Astro components and CSS recipes.\n");
