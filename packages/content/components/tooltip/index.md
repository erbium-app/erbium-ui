---
title: "Tooltip"
description: "Brief help shown on hover or focus."
---

## Usage

Show a popup related to an element when it receives keyboard focus or pointer hover.

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
