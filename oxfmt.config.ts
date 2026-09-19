import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  extends: [ultracite],
  ignorePatterns: [
    "**/.astro/**",
    "**/.blume/**",
    "**/dist/**",
    "**/storybook-static/**",
    "**/routeTree.gen.ts",
  ],
});
