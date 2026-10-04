import type { APIRoute } from "astro";
import { agentPages, llmsFull, llmsIndex, markdownPath, pageIndex, site } from "../lib/agent-pages";

const json = (value: unknown) => JSON.stringify(value, null, 2);
const artifacts = [
  { path: "/llms.txt", type: "text/plain", body: llmsIndex },
  { path: "/llms-full.txt", type: "text/plain", body: llmsFull },
  {
    path: "/api/docs.json",
    type: "application/json",
    body: json({ title: "Erbium UI", pages: pageIndex }),
  },
  {
    path: "/agent-readability.json",
    type: "application/json",
    body: json({
      site,
      artifacts: {
        index: `${site}/llms.txt`,
        full: `${site}/llms-full.txt`,
        pages: `${site}/api/docs.json`,
        openapi: `${site}/openapi.json`,
        skills: `${site}/.well-known/agent-skills/index.json`,
        sitemap: `${site}/sitemap.xml`,
      },
      pages: pageIndex,
    }),
  },
  {
    path: "/.well-known/agent-skills/index.json",
    type: "application/json",
    body: json({
      skills: [
        {
          name: "erbium-ui",
          description: "Install and compose Erbium UI React components and examples.",
          url: `${site}/.well-known/agent-skills/erbium-ui/SKILL.md`,
        },
      ],
    }),
  },
  {
    path: "/.well-known/agent-skills/erbium-ui/SKILL.md",
    type: "text/markdown",
    body: `---\nname: erbium-ui\ndescription: Install and compose Erbium UI React components and examples.\n---\n\n# Erbium UI\n\nRead ${site}/llms.txt to discover the current documentation. Read ${site}/docs/installation.md before installing. Append .md to any canonical documentation URL for its full documentation, component source and all showcase variants. Read ${site}/api/docs.json for the complete page catalog.\n\nConfigure shadcn registries @erbium as ${site}/r/ui/{name}.json and @erbium-examples as ${site}/r/examples/{name}.json. Initialize the consumer app with shadcn first. Install @erbium/styles once and then the required components or examples. Import the installed src/styles/globals.css from the app's global CSS entry; the registry does not wire that import automatically. Follow ${site}/docs/getting-started.md for providers and stories. Use registry installation to rewrite workspace imports to your project's aliases. Preserve accessibility, RTL support and shared surface tokens. Astro shell adapters belong to the docs application; the reusable UI and examples are React.\n`,
  },
  {
    path: "/robots.txt",
    type: "text/plain",
    body: `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`,
  },
  {
    path: "/sitemap.xml",
    type: "application/xml",
    body: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageIndex.map((entry) => `<url><loc>${entry.url}</loc></url>`).join("")}</urlset>`,
  },
  {
    path: "/openapi.json",
    type: "application/json",
    body: json({
      openapi: "3.1.0",
      info: { title: "Erbium UI documentation", version: "1.0.0" },
      servers: [{ url: site }],
      paths: Object.fromEntries([
        [
          "/api/docs.json",
          {
            get: {
              operationId: "listPages",
              summary: "List every documentation page and its Markdown and JSON URLs",
              responses: {
                "200": {
                  description: "Page catalog",
                  content: { "application/json": { schema: { type: "object" } } },
                },
              },
            },
          },
        ],
        ...pageIndex.map((entry) => [
          new URL(entry.jsonUrl).pathname,
          {
            get: {
              operationId: `getPage${entry.route.replaceAll(/[^a-zA-Z0-9]/g, "_")}`,
              summary: entry.title,
              responses: {
                "200": {
                  description: "Page metadata and complete Markdown source",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        required: ["title", "markdown"],
                        properties: { title: { type: "string" }, markdown: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        ]),
      ]),
    }),
  },
  ...agentPages.flatMap((entry, index) => [
    { path: markdownPath(entry.route), type: "text/markdown", body: entry.markdown },
    {
      path: new URL(pageIndex[index].jsonUrl).pathname,
      type: "application/json",
      body: json({ ...pageIndex[index], markdown: entry.markdown }),
    },
  ]),
];
export function getStaticPaths() {
  return artifacts.map((artifact) => ({
    params: { resource: artifact.path.slice(1) },
    props: artifact,
  }));
}
export const GET: APIRoute = ({ props }) =>
  new Response(props.body, { headers: { "Content-Type": `${props.type}; charset=utf-8` } });
