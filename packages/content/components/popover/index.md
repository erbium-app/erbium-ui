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
