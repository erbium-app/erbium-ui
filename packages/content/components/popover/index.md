---
title: "Popover"
description: "Displays rich content in a portal, triggered by a button."
---

Displays rich content in a portal, triggered by a button.

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
