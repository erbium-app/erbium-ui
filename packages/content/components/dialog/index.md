---
title: "Dialog"
description: "A modal window for focused tasks."
---

## Usage

A modal dialog for focused tasks. `DialogPanel` is the popup shell; `DialogContent` is its padded, scrollable body. Place `DialogHeader`, one required `DialogContent`, and optional `DialogFooter` directly inside `DialogPanel`, in that order. The panel owns the popup and keeps the header and footer visible while the content scrolls. Header and footer separators are built in.

**Import:** `@erbium/ui/components/dialog`

## Usage

```tsx
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
import { Button } from "@erbium/ui/components/button";
```

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline">Open</Button>} />
  <DialogPanel>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your details.</DialogDescription>
    </DialogHeader>
    <DialogContent>Content</DialogContent>
    <DialogFooter>Actions</DialogFooter>
  </DialogPanel>
</Dialog>
```

## Composition

```text
Dialog
├── DialogTrigger
└── DialogPanel
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    ├── DialogContent
    └── DialogFooter
```
