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

The UI package also publishes a shadcn-compatible registry. Build the registry after changing a component:

```bash
bun run ui:registry
```

Build the Erbium registry whenever you add or change a UI component, hook, utility, stylesheet, or Storybook example:

```bash
bun run ui:registry
```

This generates `packages/ui/registry.json` and the static install payloads in `packages/ui/public/r`. The catalog includes the package's components, hooks, utilities, and global styles. Internal component dependencies use the `@erbium/` namespace, and file targets preserve the `src/components`, `src/hooks`, `src/lib`, and `src/styles` layout so relative imports keep working after installation.

Host `packages/ui/public/r` at a stable HTTPS URL, then consumers can add the registry to their `components.json`:

```json
{
  "registries": { "@erbium": "https://your-domain.example/r/{name}.json" }
}
```

They can then use the standard CLI to discover and install components, hooks, styles, and utilities:

```bash
bunx shadcn@latest list @erbium
bunx shadcn@latest add @erbium/sidebar @erbium/use-mobile
bunx shadcn@latest add @erbium/styles
```

The registry installs copied source files, while `@erbium/ui` remains useful as a conventional package dependency. Add `@erbium/styles` when you want Erbium's global tokens and Tailwind utilities; include `src/styles/globals.css` in the app's stylesheet entry. The styles item also declares its Tailwind plugins and font dependencies.

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
