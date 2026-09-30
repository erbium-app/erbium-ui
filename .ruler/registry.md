# Registry sync

- Before committing UI changes, rebuild the registry and commit its output with them.
- `packages/ui/src` changes: `bun run ui:registry`.
- `apps/storybook/src/examples` changes: `bun run storybook:registry`.
- Never hand-edit generated registry files; commit unrelated regenerated items separately.
