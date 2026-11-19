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
  // Sort Tailwind classes against Erbium's theme so custom utilities and
  // variants sort like built-in ones. Setting this replaces the preset's
  // value, so spread it to keep its `functions` list. An unresolved path
  // turns sorting off silently; check that classes still sort after moving
  // the stylesheet.
  sortTailwindcss: {
    ...ultracite.sortTailwindcss,
    stylesheet: "./packages/ui/src/styles/globals.css",
  },
});
