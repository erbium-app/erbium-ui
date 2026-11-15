---
title: "Button"
description: "Triggers an action when pressed."
---

## Usage

Render a button or give another element the appearance of a button.

**Import:** `@erbium/ui/components/button`

## Usage

```tsx
import { Button } from "@erbium/ui/components/button";
```

```tsx
<Button variant="outline">Button</Button>
```

## Keyboard shortcuts

Pass `hotkey` to register a shortcut that clicks the button while it is mounted, enabled, and not loading. Clicking runs `onClick`, submits a form, or follows a rendered link, the same as a pointer press. The button sets `aria-keyshortcuts` for chords and shows the shortcut in a badge above itself while the user holds one of the shortcut's modifiers (see `KbdHint` for placement). Place a `ButtonShortcut` inside to label the shortcut permanently instead; it reads the button's `hotkey` when it has none of its own.

```tsx
<Button hotkey="Mod+S" onClick={save}>
  Save
  <ButtonShortcut />
</Button>
```

The registration is named after `aria-label` or `title` for TanStack Hotkeys devtools and shortcut lists. While a modal dialog is open, shortcuts registered outside it pause, so a page button's shortcut cannot fire behind the dialog.

## Cursor

Tailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.

To keep the `cursor: pointer` behavior, add `cursor-pointer` to your buttons.

You can also enable this during project setup with `npx shadcn@latest init --pointer`.
