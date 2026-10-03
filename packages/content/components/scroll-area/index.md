---
title: "Scroll Area"
description: "Augments native scroll functionality for custom, cross-browser styling."
---

Augments native scroll functionality for custom, cross-browser styling.

**Import:** `@erbium/ui/components/scroll-area`

## Usage

```tsx
import { ScrollArea, ScrollBar } from "@erbium/ui/components/scroll-area";
```

```tsx
<ScrollArea className="h-[200px] w-[350px] rounded-xl border surface-panel p-4">
  Your scrollable content here.
</ScrollArea>
```

## Composition

Use the following composition to build a `ScrollArea`:

```text
ScrollArea
└── ScrollBar
```
