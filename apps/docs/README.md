# Documentation website

The Astro site renders Markdown from `@erbium/content` and interactive React islands from `@erbium/showcase`. Every shared catalog variant appears on its component page, including playground controls, all source files and registry installation commands. Storybook consumes the same catalogs.

Run `bun run showcase` at the workspace root to start both sites. Authoring instructions are in [the showcase package](../../packages/showcase/README.md). Validate synchronization with `bun run showcase:check`.

The registry integration serves `/r/ui/{name}.json` and `/r/examples/{name}.json` locally and copies the canonical package artifacts into the static build. No app-specific copies of examples or Markdown are maintained.
