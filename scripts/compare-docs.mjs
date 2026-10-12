import { writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const [
  astro = "http://127.0.0.1:4322",
  start = "http://127.0.0.1:3002",
  output = "/tmp/erbium-docs-comparison.json",
] = process.argv.slice(2);
const samples = [
  "/",
  "/docs/installation",
  "/docs/components/button",
  "/docs/foundations/colors",
  "/docs/blocks/code-block",
];
const attr = (tag, name) => new RegExp(`\\b${name}=["']([^"']*)["']`, "i").exec(tag)?.[1];
function metadata(html) {
  const tags = [...html.matchAll(/<(meta|link)\b[^>]*>/gi)].map(([tag]) => tag);
  const canonical = tags.find((tag) => attr(tag, "rel") === "canonical");
  return {
    title: /<title>([^<]+)<\/title>/i.exec(html)?.[1] ?? null,
    description:
      attr(tags.find((tag) => attr(tag, "name") === "description") ?? "", "content") ?? null,
    canonical: canonical ? attr(canonical, "href") : null,
    ogImage:
      attr(tags.find((tag) => attr(tag, "property") === "og:image") ?? "", "content") ?? null,
    structuredData: html.includes("application/ld+json"),
    h1Count: [...html.matchAll(/<h1\b/gi)].length,
  };
}
async function timed(url) {
  const begin = performance.now();
  const response = await fetch(url, {
    headers: { "Accept-Encoding": "identity" },
    signal: AbortSignal.timeout(30000),
  });
  const headersMs = performance.now() - begin;
  const body = await response.text();
  return {
    response,
    body,
    headersMs,
    totalMs: performance.now() - begin,
    bytes: Buffer.byteLength(body),
  };
}
async function inspect(name, base) {
  const indexResponse = await fetch(`${base}/api/docs.json`);
  if (!indexResponse.ok) throw new Error(`${name}: page index returned ${indexResponse.status}`);
  const index = await indexResponse.json();
  const routes = index.pages.map((page) => page.route);
  const failures = [];
  const warnings = [];
  for (const path of routes) {
    const { response, body } = await timed(`${base}${path}`);
    const seo = metadata(body);
    if (
      response.status !== 200 ||
      !seo.title ||
      !seo.description ||
      !seo.canonical ||
      !seo.ogImage ||
      !seo.structuredData ||
      seo.h1Count < 1
    )
      failures.push({ path, status: response.status, seo });
    if (seo.h1Count > 1)
      warnings.push({
        path,
        message:
          "Multiple h1 elements in the full HTML, including possible component demonstrations",
        count: seo.h1Count,
      });
  }
  const resources = [];
  for (const path of [
    "/llms.txt",
    "/llms-full.txt",
    "/index.md",
    "/docs/components/button.md",
    "/api/docs/docs/components/button.json",
    "/openapi.json",
    "/agent-readability.json",
    "/.well-known/agent-skills/index.json",
    "/.well-known/agent-skills/erbium-ui/SKILL.md",
    "/robots.txt",
    "/sitemap-index.xml",
    "/r/ui/button.json",
    "/r/examples/button-overview.json",
  ]) {
    const response = await fetch(`${base}${path}`);
    const bytes = (await response.arrayBuffer()).byteLength;
    resources.push({
      path,
      status: response.status,
      bytes,
      contentType: response.headers.get("content-type"),
    });
    if (!response.ok || !bytes) failures.push({ path, status: response.status });
  }
  const measurements = [];
  for (const path of samples) {
    await timed(`${base}${path}`);
    const runs = [];
    for (let sample = 0; sample < 7; sample++) runs.push(await timed(`${base}${path}`));
    const median = (key) => runs.map((run) => run[key]).sort((a, b) => a - b)[3];
    const html = runs[0].body;
    const assetPaths = new Set();
    for (const [tag] of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
      const path =
        attr(tag, "src") ?? (attr(tag, "rel") === "modulepreload" ? attr(tag, "href") : undefined);
      if (path && /\.js(?:\?|$)/.test(path)) assetPaths.add(path);
    }
    let initialJsBytes = 0;
    for (const path of assetPaths) {
      const response = await fetch(new URL(path, base), {
        headers: { "Accept-Encoding": "identity" },
      });
      initialJsBytes += (await response.arrayBuffer()).byteLength;
    }
    measurements.push({
      path,
      headersMs: +median("headersMs").toFixed(2),
      totalMs: +median("totalMs").toFixed(2),
      htmlBytes: runs[0].bytes,
      initialJsBytes,
      seo: metadata(html),
    });
  }
  const unknown = await fetch(`${base}/docs/not-a-component`, { redirect: "manual" });
  const legacy = await fetch(`${base}/docs/typography`, { redirect: "manual" });
  if (unknown.status !== 404)
    failures.push({ path: "/docs/not-a-component", status: unknown.status });
  const ogPath = new URL(measurements[0].seo.ogImage).pathname;
  const og = await fetch(`${base}${ogPath}`);
  const ogBytes = (await og.arrayBuffer()).byteLength;
  if (og.status !== 200 || !og.headers.get("content-type")?.includes("image/jpeg"))
    failures.push({ path: ogPath, status: og.status });
  return {
    name,
    base,
    routes,
    failures,
    warnings,
    resources,
    measurements,
    unknownStatus: unknown.status,
    legacyRedirect: { status: legacy.status, location: legacy.headers.get("location") },
    og: { status: og.status, bytes: ogBytes },
  };
}
const results = [];
for (const [name, base] of [
  ["Astro", astro],
  ["TanStack Start", start],
])
  results.push(await inspect(name, base));
const parity = {
  missingInStart: results[0].routes.filter((path) => !results[1].routes.includes(path)),
  extraInStart: results[1].routes.filter((path) => !results[0].routes.includes(path)),
};
const report = {
  measuredAt: new Date().toISOString(),
  method:
    "Production previews; 1 warmup, 7 sequential requests per sample, median. Uncompressed bytes. HTTP header latency is not browser TTFB; initial JS counts HTML module references only, excluding transitive imports and lazy previews. These are local checks, not Core Web Vitals or ranking predictions.",
  parity,
  results,
};
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`Saved ${output}\n`);
for (const result of results) {
  process.stdout.write(
    `${result.name}: ${result.routes.length} routes, ${result.failures.length} failures\n`,
  );
  for (const row of result.measurements)
    process.stdout.write(
      `${row.path}: headers ${row.headersMs}ms, HTML ${row.htmlBytes}B, referenced JS ${row.initialJsBytes}B\n`,
    );
}
if (results.some((result) => result.failures.length) || parity.missingInStart.length)
  process.exitCode = 1;
