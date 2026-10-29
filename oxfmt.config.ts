import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  extends: [ultracite],
  // Vendored skill content is third-party; reformatting it breaks skill update hashes.
  ignorePatterns: [
    "**/dist/**",
    "**/storybook-static/**",
    "**/routeTree.gen.ts",
    "**/.agents/skills/**",
  ],
});
