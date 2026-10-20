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
    markdown: content,
    tree: compileMarkdown(content),
  };
};
export const getPage = async (path: string) => {
  const component = components.find((item) => item.href === path);
  const guide = guides.find((item) => item.href === path);
  if (!component && !guide) return null;
  const content = document(component ? `components/${component.name}/index` : guide!.file);
  const catalog =
    component && component.name !== "colors" ? await loadShowcase(component.name) : undefined;
  return {
    ...content,
    path,
    name: component?.name ?? "",
    section: component?.section ?? guide!.section,
    headings: headingsFor(content.tree),
    reference: component ? componentReference(component.name) : undefined,
    sourceUrl: component?.files[0]
      ? `https://github.com/erbium-app/erbium-ui/blob/main/packages/ui/${component.files[0].path}`
      : undefined,
    image: ogPageForRoute(path).imagePath,
    colorSources: component?.name === "colors" ? colorExamples() : [],
    variants:
      manifest
        .find((entry) => entry.name === component?.name)
        ?.variants.map((variant) => ({
          ...variant,
          anchor: headingsFor(content.tree).some((heading) => heading.id === variant.slug)
            ? `example-${variant.slug}`
            : variant.slug,
          args: JSON.stringify(
            (catalog?.[variant.exportName] as ShowcaseStory | undefined)?.args ?? {},
          ),
          argTypes: JSON.stringify(
            (catalog?.[variant.exportName] as ShowcaseStory | undefined)?.argTypes ?? {},
          ),
          markdown: document(`components/${component!.name}/${variant.slug}`).markdown,
          tree: document(`components/${component!.name}/${variant.slug}`).tree,
        })) ?? [],
  };
};
export type DocPage = NonNullable<Awaited<ReturnType<typeof getPage>>>;

export const getExampleSource = (name: string, slug: string) => {
  const variant = manifest
    .find((entry) => entry.name === name)
    ?.variants.find((entry) => entry.slug === slug);
  if (!variant) throw new Error("Unknown example");
  const files = registry.items.find((item) => item.name === `${name}-${slug}`)?.files ?? [
    { path: variant.source },
  ];
  return files.map((file) => ({
    path: file.path,
    source: showcaseSource(file.path),
  }));
};

const colorExamples = () => {
  const block = (source: string, selector: string) => {
    const start = source.indexOf(`${selector} {`);
    return source.slice(start, source.indexOf("\n}", start) + 2);
  };
  return [
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
  ].map((entry) => ({
    ...entry,
    colors: [...new Set(entry.source.match(/oklch\([^)]+\)/g) ?? [])],
  }));
};
