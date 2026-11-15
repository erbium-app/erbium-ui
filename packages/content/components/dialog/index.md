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

## Opening, closing, and focus

Use the existing controlled open state and primitive event details for application-driven opening. Focus restoration should follow the actual opening control; do not force focus to a different registered trigger. Let Base UI coordinate nested overlays and trigger lifetimes, and keep the default close/unmount behavior unless a concrete integration requires retained content. Avoid application-level focus loops and extra overlay contexts.

The panel owns the surface. Header and footer own their padding; Content owns body padding and the single body scroll viewport. Do not add a ScrollArea or duplicate panel gutters inside Content. Independently scrolling search results belong beside Content, directly in the panel.

## Keyboard shortcuts

While a modal dialog is open, its panel owns the keyboard. `DialogPanel` gives each open panel an exclusive [TanStack Hotkeys scope](https://tanstack.com/hotkeys/latest/docs/framework/react/guides/hotkeys-provider-and-scopes#exclusive-scopes), so hotkeys registered outside it, such as the sidebar's `Mod+B`, pause until it closes and their hints stay hidden. Hotkeys registered by components inside the panel keep working. A dialog opened from another dialog suspends the first one in turn. `modal={false}` leaves the page's hotkeys working.

Register a dialog's own shortcuts in a component rendered inside the panel. To close a dialog with the shortcut that opened it, register that shortcut inside the panel as well, because the page's registration is paused while the dialog is open:

```tsx
const CloseOnHotkey = ({ onClose }: { onClose: () => void }) => {
  useHotkey("Mod+K", onClose);
  return null;
};

<DialogPanel>
  <CloseOnHotkey onClose={() => setOpen(false)} />…
</DialogPanel>;
```
