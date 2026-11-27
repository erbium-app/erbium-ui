// Worker settings shared by local dev and preview (vite.config.ts) and by deploys
// (packages/infra/alchemy.run.ts).
export const compatibility = { date: "2026-08-31" };

export const assets = {
  htmlHandling: "drop-trailing-slash" as const,
  notFoundHandling: "none" as const,
  // Pages reach the Worker before static files, so it can answer `Accept: text/markdown`.
  runWorkerFirst: ["/", "/docs/*", "!/docs/*.md"],
};
