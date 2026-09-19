# Code quality

- Ultracite provides the code-quality policy through the root `oxlint.config.ts` and `oxfmt.config.ts`; Vite+ is the task/runtime layer.
- Do not add Biome, ESLint, or Prettier configuration.
- Run `bun run fix` after editing JavaScript, TypeScript, JSON, CSS, Markdown, or YAML when mechanical fixes are appropriate. Run `bun run check` for a non-mutating repository check.
- Do not suppress diagnostics merely to make the gate pass. Correctness, accessibility, and type-aware findings require review.
- Use the official Oxc editor extension with the repository's Vite+ configuration so humans and agents share the same formatting and linting behavior.
