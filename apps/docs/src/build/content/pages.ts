import { changelogMarkdown } from "virtual:docs-catalog";
import matter from "gray-matter";
import {
  showcaseExampleControls,
  showcaseExamples,
  showcaseSource,
} from "@erbium/showcase/docs/metadata";
import { compileMarkdown, headingsFor } from "@/content/markdown.server";
import { components, guides } from "@/content/catalog";
import { componentReference } from "@erbium/content/markdown";
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
    tree: compileMarkdown(file === "changelog" ? `${content}\n\n${changelogMarkdown}` : content),
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
  const exampleName = component?.name ?? guide?.example?.name ?? "";
  const exampleSlug = guide?.example?.slug;
  const examples = (exampleName === "" ? [] : await showcaseExampleControls(exampleName)).filter(
    (example) => exampleSlug === undefined || example.slug === exampleSlug,
  );
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
    colorSources: component?.name === "colors" ? colorExamples() : [],
    variants: examples.map((example) => ({
      name: exampleName,
      exportName: example.exportName,
      slug: example.slug,
      files: example.files.map((file) => file.path),
      title: example.title,
      anchor: headings.some((heading) => heading.id === example.slug)
        ? `example-${example.slug}`
        : example.slug,
      args: example.args,
      argTypes: example.argTypes,
      tree: document(`components/${exampleName}/${example.slug}`).tree,
    })),
    // Plain source of every example file, once per path since examples share files. The Code tab
    // shows it at once and highlights it in place; tokens would be many times its size.
    exampleSources: Object.fromEntries(
      examples.flatMap((example) =>
        example.files.map((file) => [file.path, showcaseSource(file.path)] as const),
      ),
    ),
  };
  return page;
};

export type DocPage = NonNullable<Awaited<ReturnType<typeof getPage>>>;

const colorExamples = () => {
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
  return entries.map((entry) => ({
    ...entry,
    colors: [
      ...new Set(
        Array.from(entry.source.matchAll(/:\s*(oklch\([^;]+\))\s*;/g), ([, color]) => color),
      ),
    ],
  }));
};
