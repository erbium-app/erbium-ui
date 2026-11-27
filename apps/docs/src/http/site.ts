import * as Effect from "effect/Effect";
import * as HttpServer from "effect/http/HttpServer";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";
import * as HttpApiSchema from "effect/http-api/HttpApiSchema";
import * as Layer from "effect/Layer";
import { site } from "@/config/site";
import { SiteApi } from "./api";

const robots = `User-agent: *\n${import.meta.env.VITE_DOCS_PREVIEW === "true" ? "Disallow: /" : "Allow: /"}\nSitemap: ${site}/sitemap.xml\n`;

const sitemapIndex = `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site}/sitemap.xml</loc></sitemap></sitemapindex>`;

const apiCatalog = HttpApiSchema.withHeaders({
  body: {
    linkset: [
      {
        anchor: `${site}/api/docs.json`,
        "service-desc": [{ href: `${site}/openapi.json`, type: "application/json" }],
        "service-doc": [{ href: `${site}/llms.txt`, type: "text/plain" }],
      },
    ],
  },
  // RFC 9727 requires this on `HEAD`.
  headers: { link: `<${site}/.well-known/api-catalog>; rel="api-catalog"` },
});

const discovery = HttpApiBuilder.group(SiteApi, "discovery", (handlers) =>
  handlers
    .handle("robots", () => Effect.succeed(robots))
    .handle("sitemapIndex", () => Effect.succeed(sitemapIndex))
    .handle("apiCatalog", () => Effect.succeed(apiCatalog)),
);

export const siteApi = HttpApiBuilder.layer(SiteApi).pipe(
  Layer.provide(discovery),
  Layer.provide(HttpServer.layerServices),
);
