---
title: "Tooltip"
description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
---

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

**Import:** `@erbium/ui/components/tooltip`

## Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@erbium/ui/components/tooltip"
import {{ Button }} from "@erbium/ui/components/button"
```

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="outline">Hover</Button>} />
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```

## Composition

Use the following composition to build a `Tooltip`:

```text
Tooltip
├── TooltipTrigger
└── TooltipContent
```
