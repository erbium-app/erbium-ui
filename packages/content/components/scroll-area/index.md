---
title: "Scroll Area"
description: "A scroll container with styled scrollbars."
---

## Usage

Preserve native scrolling while applying custom styling across browsers.

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
