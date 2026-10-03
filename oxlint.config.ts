import { defineConfig } from "oxlint";
import shadcn from "ultracite/oxlint/shadcn";

export default defineConfig({
  extends: [shadcn],
  jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
  settings: {
    shadcn: { ui: "@erbium/ui/components" },
  },
  overrides: [
    {
      // Base UI owns these component styles. Some components intentionally
      // use calculated OKLCH/color-mix values that are not application tokens.
      files: ["packages/ui/src/components/**/*.{ts,tsx}"],
      rules: {
        "shadcn/no-arbitrary-values": "off",
        "shadcn/no-restyle": "off",
        "shadcn/require-static-classes": "off",
      },
    },
  ],
  plugins: ["react", "typescript", "unicorn"],
  rules: {
    "vite-plus/prefer-vite-plus-imports": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "shadcn/no-restyle": [
      "error",
      {
        allow: ["*"],
        deny: ["[--surface-face:*]", "*:[--surface-face:*]"],
      },
    ],
  },
  ignorePatterns: [
    "**/.astro/**",
    "**/.blume/**",
    "**/dist/**",
    "**/storybook-static/**",
    "**/routeTree.gen.ts",
  ],
});
