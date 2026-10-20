import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";

const sitemapIndex = () =>
  new Response(
    `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site}/sitemap.xml</loc></sitemap></sitemapindex>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: sitemapIndex,
      HEAD: sitemapIndex,
    },
  },
});
