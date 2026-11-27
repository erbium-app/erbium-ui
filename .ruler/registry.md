# Registry

- `vp run registry` rebuilds all generated files. Never hand-edit them.
  - It runs by itself before the docs and Storybook dev servers and builds, before deploys, after `vp run update` and in the pre-commit hook, which stages the output.
  - The hook skips the rebuild when registry sources have unstaged changes. Then run it yourself and commit the output with the change.
  - CI fails on stale output through `vp run registry:check`.
- If a rebuild changes items your change doesn't touch, commit those files first, on their own.
