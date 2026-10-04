import { componentReferences } from "@erbium/content/markdown";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import manifest from "@erbium/showcase/manifest";
import registry from "@erbium/showcase/registry";
import { showcaseSource } from "@erbium/showcase/sources";
import { components } from "../data/components";
import { site } from "./site-config";
export { site } from "./site-config";
const documents = import.meta.glob<string>("../../../../packages/content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const sources = import.meta.glob<string>("../../../../packages/ui/src/**/*.{ts,tsx,css}", {
  eager: true,
  query: "?raw",
  import: "default",
});
const portableStories = import.meta.glob<{ files: Array<{ path: string; content: string }> }>(
  "../../../../packages/showcase/public/r/*-stories.json",
  { eager: true, import: "default" },
);
const contentRoot = "../../../../packages/content/";
const sourceRoot = "../../../../packages/ui/";
export const markdownPath = (route: string) => (route === "/" ? "/index.md" : `${route}.md`);
const absolute = (path: string) => `${site}${path}`;
function document(path: string) {
  const raw = documents[`${contentRoot}${path}`];
  if (!raw) throw new Error(`Missing agent documentation: ${path}`);
  return parseFrontmatter(raw);
}
function body(path: string) {
  return rewriteLinks(document(path).content.trim());
}
function code(path: string, source: string) {
  const runs = source.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
  const language = path.split(".").at(-1) ?? "text";
  return `### ${path}\n\n${fence}${language}\n${source}\n${fence}`;
}
function rewriteLinks(markdown: string) {
  return markdown.replace(
    /\]\(\/(?!\/)([^)]+)\)/g,
    (_, path: string) => `](${absolute(`/${path}`)})`,
  );
}
export interface AgentPage {
  route: string;
  title: string;
  description: string;
  section: string;
  markdown: string;
}
function page(
  route: string,
  title: string,
  description: string,
  section: string,
  content: string,
): AgentPage {
  return {
    route,
    title,
    description,
    section,
    markdown: `# ${title}\n\n> ${description}\n\nSource: ${absolute(route)}\n\n${content}\n`,
  };
}
const guides = [
  ["/", "introduction.md", "Overview"],
  ["/docs/installation", "installation.md", "Guides"],
  ["/docs/getting-started", "getting-started.md", "Guides"],
  ["/docs/typography", "typography.md", "Guides"],
  ["/docs/roadmap", "roadmap.md", "Overview"],
  ["/docs/utilities/shimmer", "shimmer.md", "Utilities"],
];
export const agentPages: AgentPage[] = guides.map(([route, file, section]) => {
  const { frontmatter } = document(file);
  return page(
    route,
    frontmatter.title,
    frontmatter.description,
    section,
    file === "typography.md"
      ? `${body("typography-introduction.md")}\n\n${body(file)}`
      : body(file),
  );
});
for (const component of components) {
  const catalog = manifest.find((entry) => entry.name === component.name)!;
  if (component.name === "colors") {
    const theme = sources[`${sourceRoot}src/styles/theme.css`];
    const surfaces = sources[`${sourceRoot}src/styles/surfaces.css`];
    agentPages.push(
      page(
        component.href,
        component.title,
        component.description,
        component.section,
        `${body("components/colors/index.md")}\n\n## Theme CSS\n\nInstall @erbium/styles for complete surface recipes. These source files define the color system.\n\n${code("theme.css", theme)}\n\n${code("surfaces.css", surfaces)}`,
      ),
    );
    continue;
  }
  const included = new Set<string>();
  const blocks = [body(`components/${component.name}/index.md`), "## Component source"];
  for (const file of component.files ?? []) {
    const source = sources[`${sourceRoot}${file.path}`];
    if (source === undefined) throw new Error(`Missing component source: ${file.path}`);
    blocks.push(code(`packages/ui/${file.path}`, source));
  }
  blocks.push("## Interactive examples");
  for (const variant of catalog.variants) {
    blocks.push(`## ${variant.title}`, body(`components/${component.name}/${variant.slug}.md`));
    const files =
      registry.items.find((item) => item.name === `${component.name}-${variant.slug}`)?.files ?? [];
    for (const file of files) {
      if (included.has(file.path)) continue;
      included.add(file.path);
      blocks.push(code(`packages/showcase/${file.path}`, showcaseSource(file.path)));
    }
    if (!included.has(variant.source)) {
      included.add(variant.source);
      blocks.push(code(`packages/showcase/${variant.source}`, showcaseSource(variant.source)));
    }
  }
  const stories =
    portableStories[`../../../../packages/showcase/public/r/${component.name}-stories.json`];
  if (stories) {
    blocks.push(
      "## Portable Storybook stories",
      "These files use the registry's installable local import paths. Install the corresponding stories registry item to include its dependencies.",
    );
    for (const file of stories.files) {
      if (included.has(file.path)) continue;
      included.add(file.path);
      blocks.push(code(`packages/showcase/${file.path}`, file.content));
    }
  }
  const references = componentReferences(component.name);
  if (references) blocks.push(references);
  agentPages.push(
    page(
      component.href,
      component.title,
      component.description,
      component.section,
      blocks.join("\n\n"),
    ),
  );
}
// Landing pages also expose the source of the examples they render.
for (const [route, names] of [["/", ["card", "input", "switch"]]] as const) {
  const landing = agentPages.find((entry) => entry.route === route)!;
  landing.markdown += `\n## Showcased components\n\n${names.map((name) => agentPages.find((entry) => entry.route === components.find((item) => item.name === name)!.href)!.markdown).join("\n\n---\n\n")}`;
}
export const pageIndex = agentPages.map(({ markdown: _markdown, ...entry }) => ({
  ...entry,
  url: absolute(entry.route),
  markdownUrl: absolute(markdownPath(entry.route)),
  jsonUrl: absolute(`/api/docs/${entry.route === "/" ? "index" : entry.route.slice(1)}.json`),
}));
export const llmsIndex = `# Erbium UI\n\n> Accessible React components with shared Markdown documentation and runnable examples.\n\nInstall components and examples through the Shadcn registries. Read the installation guide first. Source code uses workspace imports; registry installation rewrites these to local aliases.\n\n## Agent resources\n\n- [Full documentation](${site}/llms-full.txt): Every page with component and example source.\n- [Page index](${site}/api/docs.json): JSON catalog linking Markdown and JSON pages.\n- [OpenAPI](${site}/openapi.json): Read-only documentation API.\n- [Agent discovery](${site}/agent-readability.json)\n- [Usage skill](${site}/.well-known/agent-skills/erbium-ui/SKILL.md)\n- [Sitemap](${site}/sitemap-index.xml)\n\n${[
  ...new Set(agentPages.map((entry) => entry.section)),
]
  .map(
    (section) =>
      `## ${section}\n\n${pageIndex
        .filter((entry) => entry.section === section)
        .map((entry) => `- [${entry.title}](${entry.markdownUrl}): ${entry.description}`)
        .join("\n")}`,
  )
  .join("\n\n")}\n`;
export const llmsFull = agentPages.map((entry) => entry.markdown).join("\n\n---\n\n");
