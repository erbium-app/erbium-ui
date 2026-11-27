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
- `vp run check` fails on existing errors (257 as of 2026-11-17). Don't fix unrelated files, and don't raise that count.
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
