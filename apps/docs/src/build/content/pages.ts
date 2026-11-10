import matter from "gray-matter";
import { loadShowcase, type ShowcaseStory } from "@erbium/showcase/catalog";
import manifest from "@erbium/showcase/manifest";
import { compileMarkdown, headingsFor } from "@/content/markdown.server";
import { components, guides } from "@/content/catalog";
import { componentReference } from "@erbium/content/markdown";
import { showcaseSource } from "@erbium/showcase/sources";
import registry from "@erbium/showcase/registry";
import theme from "@ui/src/styles/theme.css?raw";
import surfaces from "@ui/src/styles/surfaces.css?raw";
import { ogPageForRoute } from "@/build/seo/og-pages";
import { highlightCode } from "@erbium/ui/lib/code-highlighter";
import type { CodeBlockTokens } from "@erbium/ui/blocks/code-block";
import { highlightKey, type CodeHighlights } from "@/content/code-highlights";

const plainLanguages = new Set(["", "text", "plain", "plaintext", "txt"]);

// Pages carry only what CodeBlock renders: token text, offsets, and theme variables.
const highlight = async (code: string, language: string): Promise<CodeBlockTokens> => {
  const { rootStyle, tokens } = await highlightCode(code, language);
  return {
    rootStyle,
    tokens: tokens.map((line) =>
      line.map(({ content, offset, htmlStyle }) => ({ content, offset, htmlStyle })),
    ),
  };
};

// Fences can sit inside lists, quotes, and callouts, so walk every node.
const codeFences = (node: unknown): { lang: string; value: string }[] => {
  if (Array.isArray(node)) return node.flatMap(codeFences);
  if (typeof node !== "object" || node === null) return [];
  if ("type" in node && node.type === "code" && "value" in node && typeof node.value === "string") {
    const lang = "lang" in node && typeof node.lang === "string" ? node.lang : "plaintext";
    return [{ lang, value: node.value }];
  }
  return Object.values(node).flatMap(codeFences);
};

const highlightFences = async (trees: unknown[]): Promise<CodeHighlights> =>
  Object.fromEntries(
    await Promise.all(
      codeFences(trees)
        .filter((fence) => !plainLanguages.has(fence.lang))
        .map(
          async (fence) =>
            [
              highlightKey(fence.lang, fence.value),
              await highlight(fence.value, fence.lang),
            ] as const,
        ),
    ),
  );

const documents = import.meta.glob<string>("../../../../../packages/content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const document = (file: string) => {
  const raw = documents[`../../../../../packages/content/${file}.md`];
  if (!raw) throw new Error(`Missing content: ${file}`);
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    tree: compileMarkdown(content),
  };
};
export const getPage = async (path: string) => {
  const component = components.find((item) => item.href === path);
  const guide = guides.find((item) => item.href === path);
  const file = component ? `components/${component.name}/index` : guide?.file;
  const section = component?.section ?? guide?.section;
  if (file === undefined || section === undefined) return null;
  const content = document(file);
  const headings = headingsFor(content.tree);
  const catalog =
    component && component.name !== "colors" ? await loadShowcase(component.name) : undefined;
  const page = {
    ...content,
    path,
    name: component?.name ?? "",
    section,
    headings,
    reference: component ? componentReference(component.name) : undefined,
    sourceUrl: component?.files[0]
      ? `https://github.com/erbium-app/erbium-ui/blob/main/packages/ui/${component.files[0].path}`
      : undefined,
    image: ogPageForRoute(path).imagePath,
    colorSources: component?.name === "colors" ? await colorExamples() : [],
    variants:
      manifest
        .find((entry) => entry.name === component?.name)
        ?.variants.map((variant) => ({
          ...variant,
          anchor: headings.some((heading) => heading.id === variant.slug)
            ? `example-${variant.slug}`
            : variant.slug,
          args: (catalog?.[variant.exportName] as ShowcaseStory | undefined)?.args ?? {},
          argTypes: (catalog?.[variant.exportName] as ShowcaseStory | undefined)?.argTypes ?? {},
          tree: document(`components/${component!.name}/${variant.slug}`).tree,
        })) ?? [],
  };
  return {
    ...page,
    highlights: await highlightFences([page.tree, page.variants.map((variant) => variant.tree)]),
  };
};

export type DocPage = NonNullable<Awaited<ReturnType<typeof getPage>>>;

export const getExampleSource = async (name: string, slug: string) => {
  const variant = manifest
    .find((entry) => entry.name === name)
    ?.variants.find((entry) => entry.slug === slug);
  if (!variant) throw new Error("Unknown example");
  const files = registry.items.find((item) => item.name === `${name}-${slug}`)?.files ?? [
    { path: variant.source },
  ];
  return await Promise.all(
    files.map(async (file) => {
      const source = showcaseSource(file.path);
      return {
        path: file.path,
        source,
        tokens: await highlight(source, file.path.split(".").at(-1) ?? "text"),
      };
    }),
  );
};

const colorExamples = async () => {
  const block = (source: string, selector: string) => {
    const start = source.indexOf(`${selector} {`);
    return source.slice(start, source.indexOf("\n}", start) + 2);
  };
  const entries = [
    {
      id: "light-colors",
      title: "Light colors",
      appearance: "light",
      source: block(theme, ":root"),
    },
    { id: "dark-colors", title: "Dark colors", appearance: "dark", source: block(theme, ".dark") },
    {
      id: "surface-colors",
      title: "Surface colors",
      appearance: "",
      source: `${block(surfaces, ":root")}\n\n${block(surfaces, ".dark")}`,
    },
    {
      id: "tailwind-mappings",
      title: "Tailwind mappings",
      appearance: "",
      source: `${block(theme, "@theme inline")}\n\n${block(surfaces, "@theme inline")}`,
    },
  ];
  return await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      colors: [...new Set(entry.source.match(/oklch\([^)]+\)/g) ?? [])],
      tokens: await highlight(entry.source, "css"),
    })),
  );
};
