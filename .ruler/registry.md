# Registry

- Rebuild the registry before committing and commit the output with the change. Never hand-edit generated files.
  - After changes in `packages/ui/src`, run `bun run ui:registry`.
  - After changes in `packages/showcase/src` or `packages/content`, run `bun run showcase:generate && bun run showcase:registry`. `bun run showcase:check` verifies them.
- Commit unrelated regenerated items separately.
