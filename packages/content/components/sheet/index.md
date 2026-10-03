---
title: "Sheet"
description: "A panel for content alongside the main screen."
---

## Usage

Displays supporting content beside or above the main screen. `SheetPanel` owns the popup shell, while a direct `SheetContent` child provides the required padded, scrollable body. Optional header and footer sections go before and after the content.

**Import:** `@erbium/ui/components/sheet`

## Usage

```tsx
import {
  Sheet,
  SheetClose,
  SheetPanel,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@erbium/ui/components/sheet";
import { Button } from "@erbium/ui/components/button";
```

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline">Open</Button>} />
  <SheetPanel>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>This action cannot be undone.</SheetDescription>
    </SheetHeader>
    <SheetContent>Content</SheetContent>
    <SheetFooter>Actions</SheetFooter>
  </SheetPanel>
</Sheet>
```

## Composition

Use the following composition to build a `Sheet`:

```text
Sheet
├── SheetTrigger
└── SheetPanel
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    ├── SheetContent
    └── SheetFooter
```
