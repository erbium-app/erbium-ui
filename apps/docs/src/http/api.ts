import * as HttpApi from "effect/http-api/HttpApi";
import * as HttpApiEndpoint from "effect/http-api/HttpApiEndpoint";
import * as HttpApiGroup from "effect/http-api/HttpApiGroup";
import * as HttpApiSchema from "effect/http-api/HttpApiSchema";
import * as Schema from "effect/Schema";

const text = (contentType: string) => Schema.String.pipe(HttpApiSchema.asText({ contentType }));

const Target = Schema.Struct({ href: Schema.String, type: Schema.String });

/** An RFC 9727 API catalog, in the RFC 9264 linkset format. */
const ApiCatalog = Schema.Struct({
  linkset: Schema.Array(
    Schema.Struct({
      anchor: Schema.String,
      "service-desc": Schema.Array(Target),
      "service-doc": Schema.Array(Target),
    }),
  ),
}).pipe(
  HttpApiSchema.asJson({
    contentType: 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  }),
);

/** The endpoints the Worker generates itself. Everything else is a built file or a page. */
export class SiteApi extends HttpApi.make("site").add(
  HttpApiGroup.make("discovery").add(
    HttpApiEndpoint.get("robots", "/robots.txt", {
      success: text("text/plain; charset=utf-8"),
    }),
    HttpApiEndpoint.get("sitemapIndex", "/sitemap-index.xml", {
      success: text("application/xml; charset=utf-8"),
    }),
    HttpApiEndpoint.get("apiCatalog", "/.well-known/api-catalog", {
      success: HttpApiSchema.WithHeaders(ApiCatalog, { link: Schema.String }),
    }),
  ),
) {}
