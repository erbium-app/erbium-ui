import cloudflare from "@alchemy.run/cloudflare-runtime/vite";
import { createBuilder } from "vite-plus";

// Use the same Alchemy integration as deployment without any account operations.
process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED = "1";
const builder = await createBuilder(
  {
    root: import.meta.dirname,
    build: { outDir: "dist-cloudflare" },
    define: { "import.meta.env.VITE_DOCS_PREVIEW": JSON.stringify("true") },
    plugins: [
      cloudflare({ compatibilityDate: "2026-09-25", compatibilityFlags: ["nodejs_compat"] }),
    ],
  },
  null,
);
await builder.buildApp();
