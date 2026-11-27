import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";
import * as Effect from "effect/Effect";
import * as HttpEffect from "effect/http/HttpEffect";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpServerRequest from "effect/http/HttpServerRequest";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import { site } from "@/config/site";

const contentType = "text/markdown; charset=utf-8";

const start = HttpEffect.fromWebHandler(async (request) => await handler.fetch(request));

const asset = (request: Request) => Effect.promise(async () => await env.ASSETS.fetch(request));

// The quality an Accept header gives a media type it names, or 0.
const quality = (accept: string, type: string) => {
  const entry = accept
    .split(",")
    .map((range) => range.split(";").map((part) => part.trim().toLowerCase()))
    .find(([name]) => name === type);

  const weight = entry?.find((part) => part.startsWith("q="));

  return entry ? Number(weight?.slice(2) ?? 1) : 0;
};

// Only a client that names Markdown gets it, so browsers and `*/*` keep HTML.
const prefersMarkdown = (accept: string) => {
  const markdown = quality(accept, "text/markdown");

  return markdown > 0 && markdown >= quality(accept, "text/html");
};

/** The page's prerendered `.md` file, served at the page's own URL. */
const markdownPage = Effect.fn("markdownPage")(function* markdownPage(request: Request) {
  const url = new URL(request.url);
  url.pathname = `${url.pathname.replace(/\/$/u, "") || "/index"}.md`;
  const file = yield* asset(new Request(url, { headers: request.headers }));

  if (file.status === 404) {
    return HttpServerResponse.text(
      `# Page not found\n\nEvery documentation page is listed in ${site}/llms.txt.\n`,
      { contentType, status: 404 },
    );
  }

  const body = new Uint8Array(yield* Effect.promise(async () => await file.arrayBuffer()));
  const headers = new Headers(file.headers);

  // `_headers` keeps `.md` URLs out of search results. This response is the page
  // itself, so only preview deployments stay hidden.
  if (import.meta.env.VITE_DOCS_PREVIEW !== "true") {
    headers.delete("x-robots-tag");
  }

  if (file.status === 200) {
    // An estimate of four bytes per token.
    headers.set("x-markdown-tokens", String(Math.ceil(body.byteLength / 4)));
  }

  return HttpServerResponse.uint8Array(body, { contentType, headers, status: file.status });
});

const htmlPage = Effect.fn("htmlPage")(function* htmlPage(request: Request) {
  const file = yield* asset(request);

  return file.status === 404
    ? yield* start
    : HttpServerResponse.raw(file, { headers: file.headers, status: file.status });
});

const page = Effect.gen(function* page() {
  const request = yield* HttpServerRequest.HttpServerRequest;
  const web = yield* HttpServerRequest.toWeb(request);

  const response = prefersMarkdown(request.headers.accept ?? "")
    ? yield* markdownPage(web)
    : yield* htmlPage(web);

  const { vary } = response.headers;

  return HttpServerResponse.setHeader(response, "vary", vary ? `${vary}, Accept` : "Accept");
});

// Listed instead of `*`, which would take `HEAD` before the router retries it as `GET`.
const fallbackMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;

export const pages = HttpRouter.addAll([
  HttpRouter.route("GET", "/", page),
  HttpRouter.route("GET", "/docs/*", page),
  ...fallbackMethods.map((method) => HttpRouter.route(method, "*", start)),
]);
