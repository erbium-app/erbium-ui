# Storybook

Storybook is an adapter for the shared Erbium showcase. `src/stories` is generated from `packages/showcase/src/<component>/catalog.tsx`; Components, Hooks, Utilities, Providers, and Foundations namespaces come from `packages/content/src/sections.json` and Markdown titles.

Author React compositions in `packages/showcase/src/<component>/variants` and scenario examples in that component's `examples` directory. Attribution lives in `packages/showcase/ATTRIBUTION.md`. The docs and Storybook consume these same compositions.

Run `bun run showcase:generate` and `bun run showcase:registry` after changes, then `bun run showcase:check` from the workspace root. See [shared showcase authoring](../../packages/showcase/README.md).
