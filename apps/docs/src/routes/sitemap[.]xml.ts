import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { pages } from "@/content/catalog";

const sitemap = () =>
  new Response(
    `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${site}${page.href}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: sitemap,
      HEAD: sitemap,
    },
  },
});
