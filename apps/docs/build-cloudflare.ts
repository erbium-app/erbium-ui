import cloudflare from "@alchemy.run/cloudflare-runtime/vite";
import { createBuilder } from "vite-plus";

// Use the same Alchemy integration as deployment without any account operations.
process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED = "1";

process.env.ERBIUM_DOCS_OUTPUT_DIR = "dist-cloudflare";

const builder = await createBuilder(
  {
    define: { "import.meta.env.VITE_DOCS_PREVIEW": JSON.stringify("true") },
    plugins: [
      cloudflare({ compatibilityDate: "2026-09-25", compatibilityFlags: ["nodejs_compat"] }),
    ],
    root: import.meta.dirname,
  },
  null,
);

await builder.buildApp();
