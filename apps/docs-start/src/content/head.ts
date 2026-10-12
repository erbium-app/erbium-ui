import type { DocPage } from "./pages.server";
import { site, siteName } from "@/config/site";
import { structuredData } from "@/build/seo/structured-data";
export function pageHead(page: DocPage | null | undefined) {
  if (!page)
    return {
      meta: [{ title: "Page not found | Erbium UI" }, { name: "robots", content: "noindex" }],
    };
  const title = `${page.title} | ${siteName}`;
  const url = `${site}${page.path}`;
  const image = `${site}${page.image}`;
  return {
    meta: [
      { title },
      { name: "description", content: page.description },
      ...(import.meta.env.VITE_DOCS_PREVIEW === "true"
        ? [{ name: "robots", content: "noindex" }]
        : []),
      { property: "og:title", content: title },
      { property: "og:description", content: page.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      {
        rel: "alternate",
        type: "text/markdown",
        href: `${site}${page.path === "/" ? "/index.md" : `${page.path}.md`}`,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: structuredData(page.path, page.title, page.description, image),
      },
    ],
  };
}
