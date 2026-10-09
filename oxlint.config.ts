import { defineConfig } from "oxlint";
import shadcn from "ultracite/oxlint/shadcn";

export default defineConfig({
  extends: [shadcn],
  jsPlugins: [
    { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    { name: "erbium-typography", specifier: "./scripts/typography-lint.mjs" },
  ],
  settings: {
    shadcn: { ui: ["@erbium/ui/components", "@erbium/ui/blocks"] },
  },
  overrides: [
    {
      files: [
        "packages/ui/src/**/*.{ts,tsx}",
        "packages/showcase/src/**/*.{ts,tsx}",
        "apps/storybook/**/*.{ts,tsx}",
        "apps/website/src/**/*.{ts,tsx}",
        "apps/docs/src/{components,features}/**/*.{ts,tsx}",
      ],
      rules: {
        "erbium-typography/use-roles": "error",
        "shadcn/no-inline-styles": [
          "error",
          {
            allow: ["*"],
            deny: [
              "font",
              "font-size",
              "font-family",
              "font-weight",
              "font-variation-settings",
              "line-height",
              "letter-spacing",
            ],
            message:
              "Typography comes from Erbium text roles. Move font styling into the shared typography tokens.",
          },
        ],
      },
    },
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
