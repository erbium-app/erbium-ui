import { writeFile } from "node:fs/promises";

// Cloudflare serves this app as static assets, so endpoint Response headers alone
// do not survive deployment. Emit the host's native header file.
export function seoIntegration() {
  let config;
  return {
    name: "erbium-seo",
    hooks: {
      "astro:config:done": ({ config: resolved }) => {
        config = resolved;
      },
      "astro:build:done": async ({ dir }) => {
        const headers = [
          "/\n  Cache-Control: public, max-age=60, must-revalidate",
          "/docs/*\n  Cache-Control: public, max-age=60, must-revalidate",
          "/fonts/*\n  Access-Control-Allow-Origin: *\n  Cache-Control: public, max-age=86400",
          "/api/*\n  X-Robots-Tag: noindex",
          "/r/*\n  X-Robots-Tag: noindex",
          "/*.md\n  X-Robots-Tag: noindex",
          "/llms.txt\n  X-Robots-Tag: noindex",
          "/llms-full.txt\n  X-Robots-Tag: noindex",
          "/openapi.json\n  X-Robots-Tag: noindex",
          "/agent-readability.json\n  X-Robots-Tag: noindex",
          "/.well-known/agent-skills/*\n  X-Robots-Tag: noindex",
          "https://:worker.:subdomain.workers.dev/*\n  X-Robots-Tag: noindex",
          `/docs/*.md\n  Link: <${config.site}/docs/:splat>; rel="canonical"`,
          `/index.md\n  Link: <${config.site}/>; rel="canonical"`,
          `/api/docs/docs/*.json\n  Link: <${config.site}/docs/:splat>; rel="canonical"`,
          `/api/docs/index.json\n  Link: <${config.site}/>; rel="canonical"`,
        ];
        await writeFile(new URL("_headers", dir), `${headers.join("\n\n")}\n`);
      },
    },
  };
}
