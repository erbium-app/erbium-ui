import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  extends: [ultracite],
  ignorePatterns: ["**/dist/**", "**/storybook-static/**", "**/routeTree.gen.ts"],
});
