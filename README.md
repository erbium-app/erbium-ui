# Erbium UI

Erbium UI is an agent-first UI library for building polished product interfaces with composable, accessible components and a consistent design language.

Erbium UI is developed and maintained by [erbium-app](https://github.com/erbium-app).

It is inspired by the shadcn/ui approach: components should be understandable, adaptable, and close to the application that uses them. Erbium extends that idea with conventions designed for modern AI-assisted development, so both people and agents can discover, compose, and evolve UI safely.

The long-term goal is a shared component system for React, Astro, and React Native with consistent styling, interaction patterns, accessibility, and behavior across platforms.

## Principles

- Agent-first APIs and documentation that are easy to discover, compose, and modify.
- Accessible behavior by default, with keyboard support, sensible semantics, and predictable focus management.
- Consistent styling through design tokens, semantic variants, and a small set of composable primitives.
- RTL-ready components and internationalization-friendly defaults.
- Portable patterns that preserve the same product language across web and native surfaces.
- Application-owned composition: shared primitives live in `packages/ui`, while product-specific experiences stay in apps.

## Workspace

- `packages/ui` — the source of truth for the reusable `@erbium/ui` component library.
- `apps/website` — a React + Vite + TanStack Router playground for product-level composition.
- `apps/storybook` — the component workbench for development, states, and visual review.
- `apps/docs` — the Astro documentation site and integration examples.

React is the current implementation target. Astro and React Native are part of the platform direction; shared tokens, component contracts, and behavior conventions are being established so those adapters can be added without fragmenting the system.

The UI stylesheet enables the [Easing Gradients](https://easing-gradients.ibelick.com/) and [Shadow](https://shadow.floriankiem.com/) Tailwind plugins. Their utilities are available to consumers through `@erbium/ui/globals.css`.

## Development

```bash
bun install
bun run dev             # website, Storybook, and docs
bun run check           # formatting, linting, and type-aware checks
bun run test            # Vitest workspaces
bun run typecheck       # TypeScript checks
bun run build           # library, website, Storybook, and docs
bun run ready           # check, test, and build together
bun run knip            # unused files and dependencies
bun run update          # update all workspace dependencies with Taze
```

Use `bun run ui:add <component>` to add shadcn-compatible building blocks while the library evolves. New reusable components belong in `packages/ui`; use the website, Storybook, and docs apps to develop and verify them.

### Installing Erbium components

The UI components and Storybook examples have separate shadcn registries. Build them after changing their source files:

```bash
bun run ui:registry
bun run storybook:registry
```

The UI registry lives in `packages/ui/registry.json` and builds to `packages/ui/public/r`. The example registry lives in `apps/storybook/registry.json` and builds to `apps/storybook/public/r`. Storybook source is organized as `src/stories` for Storybook definitions and `src/examples` for reusable example components. The generated `registry/examples` files adapt package imports to the component files installed by the UI registry.

Host both `public/r` directories at stable HTTPS URLs and configure both namespaces in the consuming project's `components.json`:

```json
{
  "registries": {
    "@erbium": "https://your-domain.example/ui/r/{name}.json",
    "@erbium-examples": "https://your-domain.example/storybook/r/{name}.json"
  }
}
```

Install an example with the shadcn CLI. Its registry dependencies install the matching Erbium components into `src/components`; the example goes into `src/examples`:

```bash
bunx shadcn@latest add @erbium-examples/button-demo
```

Add `@erbium/styles` for Erbium's global tokens and Tailwind utilities, and include `src/styles/globals.css` in the app's stylesheet entry.

## Quality bar

Every component should have a clear composition model, accessible states, RTL support where relevant, responsive behavior, and documentation that an agent can use without relying on hidden context. Changes should pass `bun run check`, and meaningful behavior should be covered by Vitest tests.

Vite+ commit hooks are enabled in `.vite-hooks`, and editor integration is configured in `.vscode`. The root tooling keeps the referenced anti-slop and Ultracite packages available, while `packages/ui/components.json` records the shadcn preset settings, including RTL and pointer behavior.

## Commands

```bash
bun install
bun run dev             # web, Storybook, and docs
bun run check           # Vite+ Oxfmt/Oxlint/type-aware checks
bun run test            # Vitest workspaces
bun run typecheck       # TypeScript 7 workspaces
bun run build           # library, web, Storybook, and docs
bun run knip            # unused files and dependencies
bun run taze            # dependency update cycle
bun run skills:list     # installed project skills for Claude and Codex
bun run skills:add ...  # add a project skill through skills.sh
```

Vite+ commit hooks are enabled in `.vite-hooks`; editor integration is configured in `.vscode`. The root tooling keeps the referenced anti-slop and Ultracite packages available, and `packages/ui/components.json` captures the requested shadcn preset settings including RTL and pointer behavior.
