# Registry sync

- Before committing UI changes, rebuild the registry and commit its output with them.
- `packages/ui/src` changes: `bun run ui:registry`.
- `packages/showcase/src` or `packages/content` changes: `bun run showcase:generate` and `bun run showcase:registry`.
- Storybook adapters and the showcase manifest are generated; run `bun run showcase:check` to verify synchronization.
- Never hand-edit generated registry files; commit unrelated regenerated items separately.
