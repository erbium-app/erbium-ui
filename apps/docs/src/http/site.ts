import * as Effect from "effect/Effect";
import * as HttpServer from "effect/http/HttpServer";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";
import * as Layer from "effect/Layer";
import { site } from "@/config/site";
import { SiteApi } from "./api";

const robots = `User-agent: *\n${import.meta.env.VITE_DOCS_PREVIEW === "true" ? "Disallow: /" : "Allow: /"}\nSitemap: ${site}/sitemap.xml\n`;

const sitemapIndex = `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site}/sitemap.xml</loc></sitemap></sitemapindex>`;

const crawlers = HttpApiBuilder.group(SiteApi, "crawlers", (handlers) =>
  handlers
    .handle("robots", () => Effect.succeed(robots))
    .handle("sitemapIndex", () => Effect.succeed(sitemapIndex)),
);

export const siteApi = HttpApiBuilder.layer(SiteApi).pipe(
  Layer.provide(crawlers),
  Layer.provide(HttpServer.layerServices),
);
