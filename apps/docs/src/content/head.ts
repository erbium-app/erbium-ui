import type { DocPage } from "./pages.server";
import { site, siteName } from "@/config/site";
import { structuredData } from "@/build/seo/structured-data";

export function pageHead(page: DocPage | null | undefined) {
  if (!page) {
    return {
      meta: [{ title: "Page not found | Erbium UI" }, { content: "noindex", name: "robots" }],
    };
  }

  const title = `${page.title} | ${siteName}`;
  const url = `${site}${page.path}`;
  const image = `${site}${page.image}`;

  return {
    links: [
      { href: url, rel: "canonical" },
      {
        href: `${site}${page.path === "/" ? "/index.md" : `${page.path}.md`}`,
        rel: "alternate",
        type: "text/markdown",
      },
    ],
    meta: [
      { title },
      { content: page.description, name: "description" },
      ...(import.meta.env.VITE_DOCS_PREVIEW === "true"
        ? [{ content: "noindex", name: "robots" }]
        : []),
      { content: title, property: "og:title" },
      { content: page.description, property: "og:description" },
      { content: url, property: "og:url" },
      { content: "website", property: "og:type" },
      { content: image, property: "og:image" },
      { content: "summary_large_image", name: "twitter:card" },
      { content: title, name: "twitter:title" },
      { content: page.description, name: "twitter:description" },
      { content: image, name: "twitter:image" },
    ],
    scripts: [
      {
        children: structuredData(page.path, page.title, page.description, image),
        type: "application/ld+json",
      },
    ],
  };
}
