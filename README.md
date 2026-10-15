# Erbium UI

Erbium UI is a composable React component library for product interfaces. It uses Base UI for accessible behavior, follows familiar shadcn/ui naming and registry conventions, and adapts useful Coss UI concepts into one Erbium design language. Components are styled with shared tokens and support RTL where relevant.

Erbium UI is developed by [erbium-app](https://github.com/erbium-app).

## Workspace

- `packages/content` — shared Markdown documentation consumed by the docs site and Storybook.
- `packages/ui` — reusable components, hooks, styles, and the UI registry.
- `apps/website` — React and Vite playground for application composition.
- `apps/storybook` — component stories, examples, and the example registry.
- `apps/docs-start` — TanStack Start documentation site.

React is the current component target. React Native is a longer-term direction, not a current implementation.

## Development

Requires Bun and Node.js 22.18 or newer.

```bash
bun install
bun run dev                  # start the website, Storybook, and docs
bun run website              # start only the website
bun run storybook            # start only Storybook
bun run docs                 # start only the docs
bun run check                # format, lint, and type-aware checks
bun run fix                  # apply mechanical formatting and lint fixes
bun run typecheck            # run workspace TypeScript checks
bun run build                # build the workspaces
bun run build:cached         # opt into Vite Task build caching
bun run ready                # check and build
bun run knip                 # find unused files and dependencies
```

Vite+ and its Vite core alias are pinned together in the root Bun catalog. Run
`bunx --no-install vp migrate --no-interactive --no-agent --no-editor --no-hooks`
from the workspace root to upgrade them together. Keep the direct `vite` catalog
references and root override: Bun needs the core alias to resolve framework peers.
Storybook keeps its own CLI; `vp run` schedules workspace scripts.

The root `vite.config.ts` imports the Ultracite policy from `oxlint.config.ts` and
`oxfmt.config.ts`. The Oxc editor extension reads that same Vite+ config. Standalone
Oxc config dependencies match Vite+'s bundled versions; keep them aligned when
upgrading. `prepare` installs Vite+'s hook dispatcher, and `.vite-hooks/pre-commit`
runs `vp staged`. Check the hook installation with `bunx --no-install vp hooks status`.

Package scripts execute without caching by default. Use `build:cached` for automatic
input tracking and output restoration across app builds. `ready` always runs fresh
checks and builds. Infrastructure commands and generators also run fresh.

Run `bun run ui:registry` after changing UI source. Shared showcases live in `packages/showcase`; Markdown lives in `packages/content`. Run `bun run showcase:generate` and `bun run showcase:registry` after changing either, then `bun run showcase:check` to verify synchronization and both site builds. Commit generated output with its source changes.

See [shared showcase authoring](packages/showcase/README.md) for the component folder layout, variant catalogs, and installable examples and stories.

## Using components

Within this workspace, import a component and the shared stylesheet:

```tsx
import "@erbium/ui/globals.css";
import { Button } from "@erbium/ui/components/button";
```

The UI registry at `packages/ui/registry.json` generates installable items in `packages/ui/public/r`. The example registry at `apps/storybook/registry.json` generates items in `apps/storybook/public/r`; its examples install their UI component dependencies through the UI registry.

To use the copyable registries in another project, host both `public/r` directories and point its `components.json` at those URLs:

```json
{
  "registries": {
    "@erbium": "https://your-domain.example/ui/r/{name}.json",
    "@erbium-examples": "https://your-domain.example/storybook/r/{name}.json"
  }
}
```

Then install the shared styles and an example:

```bash
bunx shadcn@latest add @erbium/styles
bunx shadcn@latest add @erbium-examples/button-demo
```

Import `src/styles/globals.css` from the consuming app's stylesheet entry. The style item includes Erbium's tokens, fonts, and Tailwind utilities.

## Quality

New components need clear composition, accessible interaction, RTL behavior where relevant, a registry entry, and examples. Use `bun run check` for routine validation and `bun run ready` before a release review.

Repository conventions are in [AGENTS.md](./AGENTS.md). The remaining design and API decisions are tracked in [todo](./todo/README.md).
