---
title: Getting started
description: Compose installed components, examples, and stories in your project.
---

Start with [Installation](/docs/installation). The examples here use its default `@/components` alias and published registries.

## Add components as needed

```sh
bunx shadcn@latest add @erbium/field @erbium/input @erbium/dialog
```

Import from the files in your app, such as `@/components/ui/field`. The CLI brings in component dependencies automatically. Use the installation command on each component page to find its registry name.

## Supporting libraries

We use [TanStack Charts](https://tanstack.com/charts/latest), [Form](https://tanstack.com/form/latest), [Hotkeys](https://tanstack.com/hotkeys/latest), [Pacer](https://tanstack.com/pacer/latest), and [Table](https://tanstack.com/table/latest) for charts, forms, shortcuts, timing, and tables.

## Start from an example

```sh
bunx shadcn@latest add @erbium-examples/checkbox-controlled
```

```tsx
import CheckboxControlled from "@/components/showcase/checkbox/variants/controlled";

export default function App() {
  return (
    <main className="min-h-screen p-8">
      <CheckboxControlled />
    </main>
  );
}
```

Examples include their local helpers and required components. Edit the installed composition to suit your content and behavior. To install every example for a component, use its `-examples` bundle:

```sh
bunx shadcn@latest add @erbium-examples/checkbox-examples
```

## Set up providers

Install the providers required by your interface:

```sh
bunx shadcn@latest add @erbium/direction @erbium/overlay-provider @erbium/drawer @erbium/toast
```

Mount `OverlayProvider` around drawers. `DrawerIndent` wraps the page content that should inset when a drawer opens. Mount one `Toaster` for notifications created with `toast.add`.

```tsx
import { Button } from "@/components/ui/button";
import { DirectionProvider } from "@/components/ui/direction";
import { DrawerIndent } from "@/components/ui/drawer";
import { OverlayProvider } from "@/components/ui/overlay-provider";
import { Toaster, toast } from "@/components/ui/toast";

export default function App() {
  return (
    <DirectionProvider direction="ltr">
      <OverlayProvider>
        <DrawerIndent>
          <main className="min-h-screen p-8">
            <Button onClick={() => toast.add({ title: "Saved", type: "success" })}>Save</Button>
          </main>
        </DrawerIndent>
        <Toaster />
      </OverlayProvider>
    </DirectionProvider>
  );
}
```

For RTL, set the document’s `dir="rtl"` and the [Direction Provider](/docs/providers/direction) to `direction="rtl"`. Keep fixed page chrome outside `DrawerIndent`. See [Overlay Provider](/docs/providers/overlay-provider) for drawer composition and [CSP Provider](/docs/providers/csp-provider) for nonce or external stylesheet requirements.

## Customize the design

The installed `src/styles/theme.css` defines semantic colors and typography; `surfaces.css` defines depth and surface roles. Edit these files or override tokens after the global import. See [Colors](/docs/foundations/colors) and [Surfaces](/docs/foundations/surfaces).

Dark mode uses a `.dark` class on the document element. Theme persistence and system preference handling belong to your app; the Vite starter includes a theme provider.

## Install Storybook stories

For a project with React Storybook configured:

```sh
bunx shadcn@latest add @erbium-examples/button-stories
```

The bundle installs portable stories, their compositions, and Storybook development dependencies. Add `../src/components/showcase/**/*.stories.tsx` to the `stories` array in `.storybook/main.ts`, and import `../src/index.css` in `.storybook/preview.ts` so the stories use your theme.

The installed stories include controls, descriptions, and provider decorators. They work with your Storybook setup rather than installing Erbium’s workbench. Follow the [Storybook setup guide](https://storybook.js.org/docs/get-started/install) if you do not have one yet.

## Keep your changes

Installed files belong to your project. Later `shadcn add` commands may offer to replace them; review the changes before overwriting customized source. Run your app’s typecheck and production build after installation or updates.
