# Registry

- Rebuild the registry before committing and commit the output with the change. Never hand-edit generated files.
  - After changes in `packages/ui/src`, run `vp run ui:registry`.
  - After changes in `packages/showcase/src` or `packages/content`, run `vp run showcase:generate && vp run showcase:registry`. `vp run showcase:check` verifies them.
- Commit unrelated regenerated items separately.
