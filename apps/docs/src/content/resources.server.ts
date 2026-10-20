import { site } from "@/config/site";
import { pages } from "./catalog";

export const resourceResponse = async (request: Request) => {
  const path = new URL(request.url).pathname;

  if (path === "/robots.txt") {
    return new Response(
      `User-agent: *\n${import.meta.env.VITE_DOCS_PREVIEW === "true" ? "Disallow: /" : "Allow: /"}\nSitemap: ${site}/sitemap.xml\n`,
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  if (path === "/sitemap-index.xml") {
    return new Response(
      `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site}/sitemap.xml</loc></sitemap></sitemapindex>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }

  if (path === "/sitemap.xml") {
    return new Response(
      `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${site}${page.href}</loc></url>`).join("")}</urlset>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }

  return null;
};
