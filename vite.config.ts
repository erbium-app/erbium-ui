import { defineConfig } from "vite-plus";
import shadcn from "ultracite/oxlint/shadcn";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["**/.astro/**", "**/.blume/**", "**/dist/**", "**/storybook-static/**"],
  },
  lint: {
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      ...(shadcn.jsPlugins ?? []),
    ],
    ignorePatterns: [
      "**/.astro/**",
      "**/.blume/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/routeTree.gen.ts",
    ],
    overrides: [
      {
        files: ["packages/ui/src/components/**/*.{ts,tsx}"],
        rules: {
          "shadcn/no-arbitrary-values": "off",
          "shadcn/no-restyle": "off",
          "shadcn/require-static-classes": "off",
        },
      },
    ],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
