/// <reference types="vite/client" />

// Build-time keys that Alchemy's `Cloudflare.Website.Vite` passes through `env`
// (packages/infra/alchemy.run.ts). Local builds run without them.
interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_ANALYTICS_TOKEN?: string;
  readonly VITE_DOCS_PREVIEW?: "true";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// The one Worker binding the docs use: Alchemy adds it on deploy, vite.config.ts locally.
declare module "cloudflare:workers" {
  export const env: { ASSETS: { fetch: (request: Request) => Promise<Response> } };
}
