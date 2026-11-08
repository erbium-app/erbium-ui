---
title: "Popover"
description: "A popup for supporting content and controls."
---

## Usage

Open rich content in a portal from a button trigger.

**Import:** `@erbium/ui/components/popover`

## Usage

```tsx
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@erbium/ui/components/popover"
import {{ Button }} from "@erbium/ui/components/button"
```

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Title</PopoverTitle>
      <PopoverDescription>Description text here.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
```

## Composition

Use the following composition to build a `Popover`:

```text
Popover
├── PopoverTrigger
└── PopoverContent
```

## Interaction ownership

Let the primitive own trigger registration, focus guards, and close animations. Reopening a retained popup or remounting a closed trigger should not require custom transition state. Keep normal unmounting as the default.

The surface provides the shared compact panel gutter. Compose content inside that gutter without adding another padded wrapper. A popover that holds a [Calendar](/docs/components/calendar) tightens its gutter to the calendar's own padding and matches its radius, so a date picker popup reads the same as a standalone calendar.
