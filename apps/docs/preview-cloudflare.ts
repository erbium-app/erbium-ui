import { preview } from "vite-plus";

process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED = "1";

process.env.ERBIUM_DOCS_OUTPUT_DIR = "dist-cloudflare";

const server = await preview({
  preview: { host: "127.0.0.1", port: 3003, strictPort: true },
  root: import.meta.dirname,
});

server.printUrls();
