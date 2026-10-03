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

## Cursor

Tailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.

To keep the `cursor: pointer` behavior, add `cursor-pointer` to your buttons.

You can also enable this during project setup with `npx shadcn@latest init --pointer`.
