import * as HttpApi from "effect/http-api/HttpApi";
import * as HttpApiEndpoint from "effect/http-api/HttpApiEndpoint";
import * as HttpApiGroup from "effect/http-api/HttpApiGroup";
import * as HttpApiSchema from "effect/http-api/HttpApiSchema";
import * as Schema from "effect/Schema";

const text = (contentType: string) => Schema.String.pipe(HttpApiSchema.asText({ contentType }));

/** The endpoints the Worker generates itself. Everything else is a built file or a page. */
export class SiteApi extends HttpApi.make("site").add(
  HttpApiGroup.make("crawlers").add(
    HttpApiEndpoint.get("robots", "/robots.txt", {
      success: text("text/plain; charset=utf-8"),
    }),
    HttpApiEndpoint.get("sitemapIndex", "/sitemap-index.xml", {
      success: text("application/xml; charset=utf-8"),
    }),
  ),
) {}
