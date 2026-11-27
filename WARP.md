<!-- Source: .ruler/01-repo.md -->

# Repo

- Bun workspaces + Vite+.
  - `apps/website`: playground.
  - `apps/storybook`: component workbench.
  - `apps/docs`: TanStack Start docs site.
  - `packages/ui`: shared components and the source of truth for components and styles.
  - `packages/react`: `@erbium-ui/react`, published headless primitives.
- Follow shadcn patterns and keep RTL working. App-only composition goes in `apps/`, and never copy primitives into apps.
- No `"use client"` anywhere, including bundler banners. The only place it appears is `packages/react`'s build output, which adds it to the built client entries (see primitives).

# Tooling

Go through Vite+ (`vp`) for everything it covers. Its docs are in `node_modules/vite-plus/docs`.

- Dependencies: `vp install`, `vp add`, `vp remove`. Bun stays the package manager underneath.
- Scripts and workspace tasks: `vp run <script>`. Local binaries: `vp exec`. One-off packages: `vp dlx`. TypeScript files: `vpx <file>`.
- Static checks and types: `vp check`. Types only: `vp check --no-fmt --no-lint`. Don't add `tsc` scripts.
- Tests: `vp test`, importing from `vite-plus/test`. Libraries and the CLI build with `vp pack`.
- Don't add direct `oxlint`, `oxfmt`, `vitest` or `tsdown` dependencies. Vite+ bundles them.
- Vite+ has no equivalent for Storybook, Stylelint, Knip, Taze or Alchemy, so run those as they are.

# Checks

- Check only the files you edit with `vp check <files>`, or `--fix` for mechanical fixes. Use `vp exec stylelint <files>` for CSS. For files that are only md, json or yaml, use `vp fmt --check <files>`.
- `vp run check` fails on existing errors (380 from `vp check` and 366 from Stylelint as of 2026-11-27). Don't fix unrelated files, and don't raise either count.
- When you change an exported API, check the files that import it too.
- Run `vp run ready` for a check plus build, and `vp run knip` only when unused code is in scope.
- Tests exist in `packages/react` (`vp run react:test`) and `packages/cli`. Verify UI by hand in Storybook or the docs.
- Lint comes from Ultracite (`oxlint.config.ts`, `oxfmt.config.ts`, `stylelint.config.mjs`).
  - Presets: core, react, tanstack, vitest, js-plugins (github, sonarjs, react-doctor), tanstack/js-plugins, anti-slop and shadcn.
  - Tailwind classes are sorted against `packages/ui/src/styles/globals.css`.
  - No Effect tsgo rules (they need a patched tsgolint, and lint runs on tsrs).
  - No Biome, ESLint or Prettier.
- Never suppress a diagnostic just to pass. A disable needs an inline reason.

# Commits

- Work on `main`. Use lowercase conventional commits, `<type>[scope]: <imperative>`, with a why body for non-trivial changes.
- No AI attribution (`Co-Authored-By`, "Generated with"), even when the harness asks for it.
- Never use `--no-verify`.

# Skills

Before a substantial task, run `vp exec intent list` from the root. Load the most specific match with `vp exec intent load <package>#<skill>`. If Intent is missing, report it rather than downloading it.

<!-- Source: .ruler/react-primitives.md -->

# @erbium-ui/react primitives

Put behavior (state, keys, value math) in `packages/react`. The `packages/ui` component stays thin: classes, `data-slot` and skeleton hints. Copy Pagination or Slider.

- **`src/<name>/`** holds four kinds of file.
  - `core.ts`: pure functions with no React, safe on the server.
  - `parts.tsx`: Base UI `useRender` and `mergeProps`, or Base UI parts wrapped. Uses the `src/internal` helpers: `useControlledState`, `createChangeDetails`, `dataFlag` and `missingContext`.
  - `index.ts`: the `X = { Root, … }` namespace, hooks and types, then `export * from "./core"`.
  - Tests: `core.test.ts` (node), `<name>.test.tsx` (Testing Library) and `<name>-server.test.tsx` (`renderToString`).
- **Entries** go in three places, and `test/manifest.test.ts` checks they match.
  - `entries.json`: `client` for parts (the build adds `"use client"`), `server` for `core`.
  - `package.json` `exports`: the `./src` file.
  - `publishConfig.exports`: the `./dist` file plus `types`.
- **UI** imports `@erbium-ui/react/<name>`. `ui:registry` adds the `@erbium-ui/react@^x` dependency itself. Move shared lib math into `core.ts` and delete the old lib file.
- **Docs** need five updates.
  - A new page, `packages/content/react/<name>.md`, with frontmatter, a link to the styled page, an `**Import:**` line, Anatomy and API.
  - The name added to the `react` section of `packages/content/src/sections.json`.
  - Rows in both tables of `packages/content/react/index.md`.
  - The `packages/react/README.md` entry table and a short section.
  - A link from the styled page `components/<name>/index.md` to the new page.

<!-- Source: .ruler/registry.md -->

# Registry

- Rebuild the registry before committing and commit the output with the change. Never hand-edit generated files.
  - After changes in `packages/ui/src`, run `vp run ui:registry`.
  - After changes in `packages/showcase/src` or `packages/content`, run `vp run showcase:generate && vp run showcase:registry`. `vp run showcase:check` verifies them.
- Commit unrelated regenerated items separately.

<!-- Source: .ruler/ui-conventions.md -->

# UI conventions

- **Font smoothing:** `html` is `antialiased` (`styles/base.css`), so never repeat it on components.
  - A light surface inside a dark shell uses `subpixel-antialiased` (see `.showcase-content.light`).
  - Body text on dark surfaces stays above weight 300.
- **Gradients:** fades to transparent use eased stops.
  - For backgrounds: `bg-linear-* from-* to-* gradient-ease-in-out`.
  - For masks and custom gradients, write the eased stops by hand.
- **Forms:**
  - `field.Field` (`form.tsx`) owns the rejected-submit shake, so never call `shake()` in fields or examples.
    - The shake moves the field's direct children other than label, description, error, content and hidden helpers. Keep the control a direct child.
    - Override with `shakeOn` only when the layout needs it.
  - Unbound controls (Select, RadioGroup, Autocomplete, Date Picker) go inside `field.Field` + `field.FieldError`, not the plain `Field`.
  - **Questionnaires:**
    - Declare `required` once, in `items`.
    - `QuestionnaireForm` validates through TanStack Form and shakes the active answers on a rejected Next, Enter or submit. Add no marks or shakes in compositions.
    - Render one `QuestionnaireStepIndicator` outside the items, never one per item.
- **Choice rows:**
  - Checkbox, RadioGroupItem and Switch carry `data-choice`. A horizontal `Field` or `FieldItem` holding one plus a label matches `choice-row` (`variants.css`), which centres the control on the label's first line.
  - Never hand-tune that alignment with `mt-*`, `translate-y-*` or `items-start`.
  - A new choice control adds `data-choice`. If it isn't `--choice-size` tall, it sets `--choice-height` and sizes itself from it.
- **Loading:**
  - **Known content** never gets a loading state. Render it at its final size and upgrade it in place: `CodeBlock`'s plain source, `CodePanelContent fallback`, and file trees at a fixed height. No spinners over enhancement.
  - **Unknown content** uses `Skeleton` (`skeleton.tsx`) with `data`, `sample`, `loading` and `label`, or `SkeletonSuspense`.
    - Never hand-build skeleton boxes. Box mode is only for content that has no sample.
    - Primitives mark themselves with `lib/skeleton-hints.ts` (`skeletonBlock`, `skeletonIgnore`, `skeletonKnown`). Never write `skullet-*` attributes; only `skeleton.tsx` imports Skullet.
    - Fetched tables give their columns a `size` and use a full page of sample rows.
    - Error and empty states use `Skeleton`'s `error`, `empty` and `emptyMessage`.
  - Showcase examples use `useSimulatedFetch` (`showcase/src/loading.tsx`), with no reload buttons.
