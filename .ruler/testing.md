# Validation policy

- The apps and `packages/ui` have no automated test suite.
- `packages/react` has one: run `bun run react:test` (Vitest through `vp test`, with jsdom and Testing Library). Primitives there change only with tests for the behavior they change, and new primitives ship with pure, interaction and server-render tests.
- Use `bunx vp check <edited files>` for formatting, linting, and type-aware validation of your changes (`bun run check` runs the whole repository, which has existing errors); use `bun run ready` to also build all applications.
- Verify interactive component behavior manually in Storybook or the docs playground.
