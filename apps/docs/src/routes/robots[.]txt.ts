import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";

const robots = () =>
  new Response(
    `User-agent: *\n${import.meta.env.VITE_DOCS_PREVIEW === "true" ? "Disallow: /" : "Allow: /"}\nSitemap: ${site}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: robots,
      HEAD: robots,
    },
  },
});
