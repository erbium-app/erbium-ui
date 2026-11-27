# Storybook

Storybook is an adapter for the shared Erbium showcase. `src/stories` is generated from `packages/showcase/src/<component>/catalog.tsx`; Components, Hooks, Utilities, Providers, and Foundations namespaces come from `packages/content/src/sections.json` and Markdown titles.

Author React compositions in `packages/showcase/src/<component>/variants` and scenario examples in that component's `examples` directory. The docs and Storybook consume these same compositions.

Run `vp run showcase:generate` and `vp run showcase:registry` after changes, then `vp run showcase:check` from the workspace root. See [shared showcase authoring](../../packages/showcase/README.md).
