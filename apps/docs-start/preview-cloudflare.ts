import cloudflare from "@alchemy.run/cloudflare-runtime/vite";
import { preview } from "vite-plus";

process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED = "1";
const server = await preview({
  root: import.meta.dirname,
  build: { outDir: "dist-cloudflare" },
  plugins: [cloudflare({ compatibilityDate: "2026-09-25", compatibilityFlags: ["nodejs_compat"] })],
  preview: { host: "127.0.0.1", port: 3003, strictPort: true },
});
server.printUrls();
