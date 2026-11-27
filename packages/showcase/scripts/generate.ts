import { execFileSync } from "node:child_process";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { imports, localImport } from "./source-imports.mjs";
import sectionsJson from "../../content/src/sections.json" with { type: "json" };

interface DocumentationSection {
  title: string;
  slug: string;
  kind: string;
  names: string[];
}

interface Variant {
  /** Exported story component name in the catalog source. */
  exportName: string;
  /** Documentation slug of the variant. */
  slug: string;
  /** Variant source path relative to the showcase root. */
  source: string;
  /** Usage entry followed by its local dependencies, relative to the showcase root. */
  usage: string[];
  /** Display title of the variant. */
  title: string;
}

interface Catalog {
  /** Directory name, e.g. "button". */
  name: string;
  /** Combined documentation section and display title. */
  title: string;
  /** Documented examples of the catalog. */
  variants: Variant[];
}

/** Removes the surrounding quotes of a frontmatter string. */
const unquote = (value: string): string => value.slice(1, -1);

/** Runs a command and throws when it exits unsuccessfully. */
const runCommand = (command: string, args: string[], options: { cwd: string }): void => {
  execFileSync(command, args, options);
};

// The @erbium-ui/react section documents the headless primitives without showcases, under the
// same names as the styled components.
const sections = (sectionsJson satisfies DocumentationSection[]).filter(
  (section) => section.kind !== "primitive",
);

const classifiedNames = sections.flatMap((section) => section.names);

if (new Set(classifiedNames).size !== classifiedNames.length) {
  throw new Error("Showcase names must belong to exactly one documentation section");
}

const root = path.dirname(import.meta.dirname);
const check = process.argv.includes("--check");

/**
 * Collapses textual differences that formatting may introduce: indentation,
 * wrapping whitespace, and trailing commas before a closing brace or bracket.
 *
 * @param value Formatted text.
 * @returns Whitespace-insensitive form of the text.
 */
const normalize = (value: string): string =>
  value.replaceAll(/,\s*(?=[}\]])/gu, "").replaceAll(/\s+/gu, "");

/**
 * Writes generated output when it changed, or fails on a change under --check.
 *
 * @param filePath Destination file path.
 * @param content Generated file content.
 * @returns Completes when the file is written or verified.
 */
const output = async (filePath: string, content: string): Promise<void> => {
  const actual = await readFile(filePath, "utf-8").catch(() => "");

  if (normalize(actual) === normalize(content)) {
    return;
  }

  if (check) {
    throw new Error(`Generated file is stale: ${filePath}`);
  }

  await writeFile(filePath, content);
};

interface CatalogInput {
  directory: string;
  source: string;
  markdown: string;
}

const entries = await readdir(path.join(root, "src"), { withFileTypes: true });

const directories = entries
  .filter((entry) => entry.isDirectory())
  .toSorted((a, b) => a.name.localeCompare(b.name))
  .map((entry) => entry.name);

const uncatalogued = await Promise.all(
  directories.map(async (directory): Promise<CatalogInput | null> => {
    const source = await readFile(path.join(root, "src", directory, "catalog.tsx"), "utf-8").catch(
      () => null,
    );

    if (source === null || source === "") {
      return null;
    }

    const markdown = await readFile(
      path.join(root, "../content/components", directory, "index.md"),
      "utf-8",
    );

    return { directory, markdown, source };
  }),
);

/** The catalogs whose source directory contains a catalog module. */
const catalogInputs = uncatalogued.filter((candidate) => candidate !== null);

interface CatalogPlan {
  input: CatalogInput;
  title: string;
  /** Exported story component names in catalog order. */
  exportNames: string[];
}

const plans: CatalogPlan[] = catalogInputs.flatMap((input) => {
  const section = sections.find((candidate) => candidate.names.includes(input.directory));

  if (section === undefined) {
    throw new Error(`Missing documentation classification: ${input.directory}`);
  }

  const headingMatch = /^title:[ \t]*(?<title>[^ \t\n].*)$/mu.exec(input.markdown);
  const heading = headingMatch?.groups?.title;

  if (heading === undefined) {
    throw new Error(`Missing Markdown title: ${input.directory}`);
  }

  const headingTitle = heading.startsWith('"') ? unquote(heading) : heading.trim();
  const title = `${section.title}/${headingTitle}`;
  const exportPattern = /export const (?<exportName>\w+)(?:\s*:[^=]+|\s*)=/gu;

  const exportMatches = [...input.source.matchAll(exportPattern)].map(
    (match) => match.groups?.exportName,
  );

  const exportNames = exportMatches.filter((exportName) => exportName !== undefined);

  if (exportNames.length !== exportMatches.length) {
    throw new Error(`Unnamed export in catalog: ${input.directory}`);
  }

  return [{ exportNames, input, title }];
});

const variantTasks: { plan: CatalogPlan; exportName: string }[] = plans.flatMap((plan) =>
  plan.exportNames.map((exportName) => ({ exportName, plan })),
);

const usageDependencies = async (entry: string): Promise<string[]> => {
  const seen = new Set<string>();

  const visit = async (file: string): Promise<void> => {
    if (seen.has(file)) {
      return;
    }

    seen.add(file);

    const source = await readFile(path.join(root, file), "utf-8");

    await Promise.all(
      imports(source).map(async (fileName) => {
        if (!fileName.startsWith(".")) {
          return;
        }

        const resolved = await localImport(fileName, path.join(root, file));

        if (!resolved.startsWith(path.join(root, "src") + path.sep)) {
          throw new Error(`Unresolved local usage import ${fileName} in ${file}`);
        }

        await visit(path.relative(root, resolved));
      }),
    );
  };

  await visit(entry);

  return [entry, ...[...seen].filter((file) => file !== entry).toSorted()];
};

const variants: Variant[] = await Promise.all(
  variantTasks.map(async (task): Promise<Variant> => {
    const { directory, source } = task.plan.input;
    const { exportName } = task;

    const variantPattern = new RegExp(
      `import ${exportName}Example(?:, [{][^}]*[}])? from "\\./variants/(?<slug>[^"/]+)"`,
      "u",
    );

    const variantMatch = variantPattern.exec(source);
    const slug = variantMatch?.groups?.slug;

    if (slug === undefined) {
      throw new Error(`Missing variant file: ${directory}/${exportName}`);
    }

    const variantMarkdown = await readFile(
      path.join(root, "../content/components", directory, `${slug}.md`),
      "utf-8",
    );

    const displayMatch = /^title:\s*(?<title>".*")$/mu.exec(variantMarkdown);

    const variantTitle =
      displayMatch === null || displayMatch.groups?.title === undefined
        ? exportName
        : unquote(displayMatch.groups.title);

    const entry = `src/${directory}/variants/${slug}.tsx`;

    const sourceBinding =
      new RegExp(`const ${exportName}Source = (?<binding>\\w+);`, "u").exec(source)?.groups
        ?.binding ?? `${exportName}Source`;

    const rawImport = new RegExp(
      `import ${sourceBinding} from "(?<request>\\./[^"]+)\\?raw";`,
      "u",
    ).exec(source)?.groups?.request;

    if (rawImport === undefined) {
      throw new Error(`Missing usage source: ${directory}/${exportName}`);
    }

    const usageEntry = path.join("src", directory, rawImport);
    const usageSource = await readFile(path.join(root, usageEntry), "utf-8");

    if (!/export default function [A-Z]\w*Example\(/u.test(usageSource)) {
      throw new Error(`Usage entry must export a named Example function: ${usageEntry}`);
    }

    const previewFiles = await usageDependencies(entry);

    if (!previewFiles.includes(usageEntry)) {
      throw new Error(`Usage source ${usageEntry} must be used by ${entry}`);
    }

    return {
      exportName,
      slug,
      source: entry,
      usage: await usageDependencies(usageEntry),
      title: variantTitle,
    };
  }),
);

const manifest: Catalog[] = plans.map((plan, index) => {
  const variantCount = variantTasks.filter((task) => task.plan === plan).length;

  const offset = plans
    .slice(0, index)
    .reduce((total, previous) => previous.exportNames.length + total, 0);

  return {
    name: plan.input.directory,
    title: plan.title,
    variants: variants.slice(offset, offset + variantCount),
  };
});

/** Re-exports one showcase variant under its display title. */
const adapterStory = ({ exportName, title }: Variant): string =>
  `export const ${exportName} = { ...showcases.${exportName}, name: ${JSON.stringify(title)} };`;

await Promise.all(
  manifest.map(async (catalog) => {
    const stories = catalog.variants.map(adapterStory).join("\n\n");
    const content = `// Generated by @erbium/showcase. Edit packages/showcase/src/${catalog.name} instead.\nimport meta, * as showcases from "@erbium/showcase/${catalog.name}";\n\nexport default { ...meta, title: ${JSON.stringify(catalog.title)} };\n\n${stories}\n`;

    await output(
      path.join(root, "../../apps/storybook/src/stories", `${catalog.name}.stories.tsx`),
      content,
    );
  }),
);

for (const name of classifiedNames) {
  if (name !== "colors" && !manifest.some((catalog) => catalog.name === name)) {
    throw new Error(`Documentation classification has no showcase: ${name}`);
  }
}

await output(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

process.stdout.write(
  `${check ? "Verified" : "Generated"} ${manifest.length} catalogs and ${manifest.reduce((total, catalog) => total + catalog.variants.length, 0)} variants.\n`,
);

if (!check) {
  runCommand(
    "vp",
    ["fmt", "packages/showcase/manifest.json", "apps/storybook/src/stories", "--write"],
    { cwd: path.join(root, "../..") },
  );
}

const adaptersDirectory = path.join(root, "../../apps/storybook/src/stories");
const expectedAdapters = new Set(manifest.map((catalog) => `${catalog.name}.stories.tsx`));
const adapterFiles = await readdir(adaptersDirectory);

const orphanCandidates = await Promise.all(
  adapterFiles.map(async (file) => {
    if (!file.endsWith(".stories.tsx") || expectedAdapters.has(file)) {
      return null;
    }

    const orphanPath = path.join(adaptersDirectory, file);
    const content = await readFile(orphanPath, "utf-8");

    return content.startsWith("// Generated by @erbium/showcase.") ? orphanPath : null;
  }),
);

const orphans = orphanCandidates.filter((candidate) => candidate !== null);

await Promise.all(
  orphans.map(async (orphan) => {
    if (check) {
      throw new Error(`Orphaned Storybook adapter: ${orphan}`);
    }

    await unlink(orphan);
  }),
);
