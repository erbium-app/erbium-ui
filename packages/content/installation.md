---
title: Installation
description: Add Erbium UI styles and components to your React project.
---

Import the shared theme once, then compose components using their individual imports.

## In this workspace

The apps consume `@erbium/ui` through Bun workspaces. Run `bun install` from the repository root, then start the docs and Storybook with `bun run showcase`.

## Import the theme

```tsx
import "@erbium/ui/globals.css";
```

The components use Tailwind CSS v4. Configure Tailwind in your app and include the component source in its scan when consuming source outside your app directory.

## Import a component

```tsx
import { Button } from "@erbium/ui/components/button";

export default function Example() {
  return <Button variant="outline">Continue</Button>;
}
```

## Add overlays

Wrap your React tree with `OverlayProvider` when using drawers. Mount `Toaster` once to display notifications created with `toast.add`.

```tsx
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { Toaster } from "@erbium/ui/components/toast";

export default function App() {
  return (
    <OverlayProvider>
      <Example />
      <Toaster />
    </OverlayProvider>
  );
}
```

See [CSP Provider](/docs/components/csp-provider) for nonce and external stylesheet configuration.

## Copy into a project

The UI registry generates installable files in `packages/ui/public/r`, and the example registry generates files in `packages/showcase/public/r`. Host both directories and configure their URLs in your project's `components.json`:

```json
{
  "registries": {
    "@erbium": "https://your-domain.example/r/ui/{name}.json",
    "@erbium-examples": "https://your-domain.example/r/examples/{name}.json"
  }
}
```

Replace the placeholder hosts with your registry URLs, then install the styles and an example:

```sh
bunx shadcn@latest add @erbium/styles
bunx shadcn@latest add @erbium-examples/button-demo
```

Import the installed `src/styles/globals.css` in your app's stylesheet entry. Registry installation rewrites the workspace imports to your project's local component paths and installs the component dependencies.

The documentation website publishes both registries at these paths when deployed. During local development, use `http://localhost:4321/r/ui/{name}.json` and `http://localhost:4321/r/examples/{name}.json` instead.

## Install variants or Storybook stories

Install one variant, all examples for a component, or its portable React Storybook stories:

```sh
bunx shadcn@latest add @erbium-examples/checkbox-controlled
bunx shadcn@latest add @erbium-examples/checkbox-examples
bunx shadcn@latest add @erbium-examples/checkbox-stories
```

Examples install beneath your configured components directory, in `showcase/<component>/`. Helpers and dependencies are included automatically. Import a variant directly into a React project:

```tsx
import CheckboxControlled from "@/components/showcase/checkbox/variants/controlled";

export default function App() {
  return <CheckboxControlled />;
}
```

Use your own configured component alias in the import. Portable stories add `@storybook/react` as a development dependency and include descriptions, controls, default arguments and interaction tests. Include `**/*.stories.tsx` beneath the installed component directory in your existing Storybook configuration. Erbium's class merger installs as `erbium-utils.ts` beneath the configured library alias.
