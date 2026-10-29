<!-- Source: .ruler/agent-quality.md -->

# Agent quality workflow

- When asked to validate, typecheck, clean up, run Knip, or prepare changes for review, use the repository checks below.
- The default command is `bun run check`. Fix actionable failures and repeat the same command until it passes.
- Use `bun run ready` for release-readiness checks covering checks and builds.
- Run `bun run knip` only when unused files or dependencies are in scope.

<!-- Source: .ruler/bts.md -->

# Erbium UI Monorepo

- Bun workspaces + Vite+. Apps live in `apps/`; the shared component library lives in `packages/ui/`.
- `apps/website` is the React + Vite playground, `apps/storybook` is the component workbench, and `apps/docs` is the TanStack Start documentation site.

<!-- Source: .ruler/code-quality.md -->

# Code quality

- Ultracite provides the code-quality policy through the root `oxlint.config.ts` and `oxfmt.config.ts`; Vite+ is the task/runtime layer (`lint.options` in `vite.config.ts` enables type-aware linting and type checking).
- The oxlint config extends Ultracite's full preset stack: `core`, `react`, `anti-slop` (vendored inside Ultracite — no separate `anti-slop` dependency), and `shadcn` (`@shadcn/lint` design-system rules).
- Stylelint lints CSS through the root `stylelint.config.mjs` (Ultracite's Stylelint preset); `bun run check` and `bun run fix` run it alongside Vite+.
- Do not add Biome, ESLint, or Prettier configuration.
- Run `bun run fix` after editing JavaScript, TypeScript, JSON, CSS, Markdown, or YAML when mechanical fixes are appropriate. Run `bun run check` for a non-mutating repository check.
- Do not suppress diagnostics merely to make the gate pass. Correctness, accessibility, and type-aware findings require review.
- Use the official Oxc editor extension with the repository's Vite+ configuration so humans and agents share the same formatting and linting behavior.

<!-- Source: .ruler/commit-conventions.md -->

# Commit conventions

- Work on `main` unless asked otherwise.
- Use lowercase conventional commits: `<type>[scope]: <imperative description>`.
- Add an intent/why body for non-trivial, dependency, infrastructure, security, migration, breaking, or revert commits.
- Never add AI attribution or agent co-author trailers such as Codex or Claude Code or Cursor.

<!-- Source: .ruler/no-use-client.md -->

# Client directive policy

- Do not add `"use client"` directives. This monorepo uses Vite, TanStack Start, and native React runtimes rather than React Server Components.
- Do not inject `"use client"` through bundler banners or generated output.
- React hooks and browser APIs do not require a client directive in this repository.

<!-- Source: .ruler/registry.md -->

# Registry sync

- Before committing UI changes, rebuild the registry and commit its output with them.
- `packages/ui/src` changes: `bun run ui:registry`.
- `packages/showcase/src` or `packages/content` changes: `bun run showcase:generate` and `bun run showcase:registry`.
- Storybook adapters and the showcase manifest are generated; run `bun run showcase:check` to verify synchronization.
- Never hand-edit generated registry files; commit unrelated regenerated items separately.

<!-- Source: .ruler/skill-loading.md -->

## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `bunx --no-install --package @tanstack/intent intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `bunx --no-install --package @tanstack/intent intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- Source: .ruler/testing.md -->

# Validation policy

- This project has no automated test suite or test runner configuration.
- Use `bun run check` for formatting, linting, and type-aware validation; use `bun run ready` to also build all applications.
- Verify interactive component behavior manually in Storybook or the docs playground.

<!-- Source: .ruler/ui-conventions.md -->

# UI conventions

- `packages/ui` is the source of truth for reusable components and styles.
- Follow the existing shadcn component patterns and preserve RTL support.
- Keep application-specific composition in `apps/`; do not duplicate shared primitives there.

# Font smoothing

- `html` opts into `antialiased` in `packages/ui/src/styles/base.css`; do not repeat the utility on individual components.
- macOS renders light text on dark surfaces heavier by default, so global grayscale antialiasing keeps type at its designed weight in dark themes.
- Opt a light surface back into the browser default with `subpixel-antialiased` when it sits inside a dark shell (see `.showcase-content.light`), because dark-on-light text relies on the thicker default rendering.
- Avoid body text at weight 300 or below on dark surfaces; grayscale antialiasing renders it lighter than designed, especially on 1x displays.

# Gradients

- Use eased stops for any gradient that fades to transparent so the fade has no hard edge.
- For background gradients, add `gradient-ease-in-out` (from the `easing-gradients` plugin) to `bg-linear-*` with `from-*` and `to-*`, e.g. `bg-linear-to-b from-background to-transparent gradient-ease-in-out`.
- The plugin only eases `background-image` stops. For masks and custom gradients, write the eased stops by hand.
