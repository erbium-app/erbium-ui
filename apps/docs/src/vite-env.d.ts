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
