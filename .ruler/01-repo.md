# Repo

- Bun workspaces + Vite+.
  - `apps/website`: playground.
  - `apps/storybook`: component workbench.
  - `apps/docs`: TanStack Start docs site.
  - `packages/ui`: shared components and the source of truth for components and styles.
  - `packages/react`: `@erbium-ui/react`, published headless primitives.
- Follow shadcn patterns and keep RTL working. App-only composition goes in `apps/`, and never copy primitives into apps.
- No `"use client"` anywhere, including bundler banners. The only place it appears is `packages/react`'s build output, which adds it to the built client entries (see primitives).

# Checks

- Check only the files you edit with `bunx vp check <files>`, or `--fix` for mechanical fixes. Use `bunx stylelint <files>` for CSS. For files that are only md, json or yaml, use `bunx vp fmt --check <files>`.
- `bun run check` fails on existing errors (257 as of 2026-11-17). Don't fix unrelated files, and don't raise that count.
- When you change an exported API, check the files that import it too.
- Run `bun run ready` for a check plus build, and `bun run knip` only when unused code is in scope.
- Tests exist only in `packages/react` (`bun run react:test`). Verify UI by hand in Storybook or the docs.
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

Before a substantial task, run `bunx --no-install --package @tanstack/intent intent list` from the root. Load the most specific match with `intent load <package>#<skill>`. If Intent is missing, report it rather than downloading it.
