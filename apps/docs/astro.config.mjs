import { registryPlugin, registryIntegration } from "./registry-plugin.mjs";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ui.erbium.app",
  output: "static",
  trailingSlash: "never",
  integrations: [react(), registryIntegration()],
  vite: {
    plugins: [tailwindcss(), registryPlugin()],
  },
});
