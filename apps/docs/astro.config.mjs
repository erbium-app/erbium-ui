import { registryPlugin, registryIntegration } from "./registry-plugin.mjs";
import { showcaseVitePlugin, showcaseIntegration } from "./showcase-vite-plugin.mjs";
import manifest from "@erbium/showcase/manifest";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ui.erbium.app",
  output: "static",
  markdown: { shikiConfig: { themes: { light: "github-light", dark: "github-dark" } } },
  trailingSlash: "never",
  redirects: Object.fromEntries(
    manifest
      .filter((item) => item.name.startsWith("use-"))
      .map((item) => [`/docs/components/${item.name}`, `/docs/hooks/${item.name}`]),
  ),
  integrations: [react(), registryIntegration(), showcaseIntegration()],
  vite: {
    plugins: [tailwindcss(), registryPlugin(), showcaseVitePlugin()],
  },
});
