import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";

// Ultracite's full preset stack, in the documented order:
// core (the ESLint-equivalent rule floor), react (react, react-perf, and
// jsx-a11y), anti-slop, and shadcn (@shadcn/lint design-system rules).
// Later presets win conflicts — anti-slop turns off the core rules whose
// autofixes loop against its own. The anti-slop plugin is vendored inside
// Ultracite (`ultracite/oxlint/anti-slop`), so no separate `anti-slop`
// dependency is needed.
export default defineConfig({
  extends: [core, react, antiSlop, shadcn],
  // Core's canonical ignore list already covers node_modules, dist,
  // storybook-static, and generated files (`**/*.gen.*` matches
  // routeTree.gen.ts). The Cloudflare/SSR build outputs and the registry
  // build dir come from this repo's .gitignore.
  ignorePatterns: [...(core.ignorePatterns ?? []), "**/dist-ssr", "packages/ui/.registry-build"],
  jsPlugins: [
    // Re-declared on the root config so dependency analyzers (Knip) can see
    // the `@shadcn/lint` package; oxlint loads it from the extended preset
    // either way.
    ...shadcn.jsPlugins,
    { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    { name: "erbium-typography", specifier: "./scripts/typography-lint.mjs" },
    { name: "erbium-sizing", specifier: "./scripts/sizing-lint.mjs" },
  ],
  overrides: [
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
    {
      // Ultracite's react preset configures this rule for shadcn-style
      // design systems after 8.0.1; mirror those options until the release
      // carries them. Count the design-system Label and control components
      // as a label/control pair, and look one level deeper than the default
      // depth of 2 so a control wrapped in two elements inside its label is
      // still found.
      files: ["**/*.{ts,tsx}"],
      rules: {
        "jsx-a11y/label-has-associated-control": [
          "error",
          {
            controlComponents: ["Input", "Select", "Textarea", "Checkbox", "Radio"],
            depth: 3,
            labelComponents: ["Label"],
          },
        ],
      },
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
    shadcn: {
      ui: ["@erbium/ui/components", "@erbium/ui/blocks"],
      // `buttonVariants` is a cva function, so its calls produce design-system classes the
      // rules can read. This lets `Link` take button styling without a dynamic-class error.
      variantFunctions: ["buttonVariants"],
    },
  },
});
