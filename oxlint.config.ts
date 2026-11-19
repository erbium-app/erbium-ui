import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import jsPlugins, { jsPluginSettings } from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";
import vitest from "ultracite/oxlint/vitest";

// Ultracite's preset stack, in the documented order:
// - core: the ESLint-equivalent rule floor.
// - react: react, react-perf, and jsx-a11y.
// - tanstack: file-based route filenames (`__root.tsx`, `$slug.tsx`).
// - vitest: rules for `*.test.*` files (packages/react).
// - js-plugins: eslint-plugin-github, eslint-plugin-sonarjs, and React Doctor,
//   run through oxlint's JS plugin bridge for ESLint parity.
// - tanstack/js-plugins: React Doctor's TanStack Router/Start/Query rules.
// - anti-slop and shadcn last: later presets win conflicts, and anti-slop
//   turns off the core rules whose autofixes loop against its own.
export default defineConfig({
  env: core.env,
  extends: [core, react, tanstack, vitest, jsPlugins, tanstackJsPlugins, antiSlop, shadcn],
  // Core's canonical ignore list already covers node_modules, dist,
  // storybook-static, and generated files (`**/*.gen.*` matches
  // routeTree.gen.ts). The Cloudflare/SSR build outputs and the registry
  // build dir come from this repo's .gitignore.
  ignorePatterns: [...(core.ignorePatterns ?? []), "**/dist-ssr", "packages/ui/.registry-build"],
  jsPlugins: [
    // Re-declared on the root config so dependency analyzers (Knip) can see
    // the plugin packages; oxlint loads them from the extended presets either
    // way. `jsPlugins.jsPlugins` already lists React Doctor, which
    // tanstack/js-plugins also loads.
    ...jsPlugins.jsPlugins,
    ...shadcn.jsPlugins,
    { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    { name: "erbium-typography", specifier: "./scripts/typography-lint.mjs" },
    { name: "erbium-sizing", specifier: "./scripts/sizing-lint.mjs" },
    { name: "erbium-controls", specifier: "./scripts/controls-lint.mjs" },
  ],
  overrides: [
    {
      files: ["packages/showcase/src/**/*.{ts,tsx}"],
      rules: { "erbium-controls/use-slider": "error" },
    },
    {
      // Showcase catalogs import each variant twice: once as the rendered
      // component and once as its source text via Vite's `?raw` suffix. Those
      // are distinct modules for the bundler, but oxlint's import/no-duplicates
      // strips the query string and flags them as duplicates — and its "merge
      // these imports" advice is impossible here because both imports are
      // default imports (one default export per module).
      files: ["packages/showcase/src/**/catalog.tsx"],
      rules: { "import/no-duplicates": "off" },
    },
    {
      files: [
        "packages/ui/src/lib/{button-variants,form-control-styles,sidebar-styles}.ts",
        "packages/ui/src/components/{select,toggle,tabs,number-field,input-group,menubar,toolbar,otp-field}.tsx",
      ],
      rules: { "erbium-sizing/use-geometry": "error" },
    },
    {
      files: [
        "packages/ui/src/**/*.{ts,tsx}",
        "packages/showcase/src/**/*.{ts,tsx}",
        "apps/storybook/**/*.{ts,tsx}",
        "apps/website/src/**/*.{ts,tsx}",
        "apps/docs/src/{components,features}/**/*.{ts,tsx}",
      ],
      rules: {
        "erbium-sizing/use-component-geometry": "error",
        "erbium-sizing/use-overlay-layout": "error",
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
    {
      // TanStack Router models not-found and redirect results as plain
      // control-flow objects rather than Error instances, and loaders are
      // expected to `throw notFound()` / `throw redirect()`. The rule only
      // understands Error subclasses, so it rejects every route loader that
      // guards a missing record or performs a redirect.
      files: ["apps/docs/src/routes/**/*.{ts,tsx}"],
      rules: { "typescript/only-throw-error": "off" },
    },
  ],
  rules: {
    // Core leaves no-console off; Erbium keeps the warning so stray logging
    // surfaces in review without failing the gate.
    "no-console": "warn",
    "no-debugger": "error",
    "shadcn/no-restyle": [
      "error",
      {
        allow: ["*"],
        deny: ["[--surface-face:*]", "*:[--surface-face:*]"],
      },
    ],
    "vite-plus/prefer-vite-plus-imports": "error",
  },
  settings: {
    // Oxlint does not merge `settings` from extended configs, so the root
    // config applies the js-plugins settings itself (React Doctor's curated
    // mode for ported rules such as only-export-components).
    ...jsPluginSettings,
    shadcn: {
      ui: ["@erbium/ui/components", "@erbium/ui/blocks"],
      // `buttonVariants` is a cva function, so its calls produce design-system classes the
      // rules can read. This lets `Link` take button styling without a dynamic-class error.
      variantFunctions: ["buttonVariants"],
    },
  },
});
