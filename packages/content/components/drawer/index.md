---
title: "Drawer"
description: "A sliding panel for supporting content."
---

A sliding panel for supporting content.

**Import:** `@erbium/ui/components/drawer`

## Usage

```tsx
import {
  Drawer,
  DrawerClose,
  DrawerPanel,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@erbium/ui/components/drawer";
import { Button } from "@erbium/ui/components/button";
```

```tsx
<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
  <DrawerPanel>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerContent>{/* Content here */}</DrawerContent>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerPanel>
</Drawer>
```

## Composition

Use the following composition to build a `Drawer`:

`DrawerPanel` composes the portal, overlay, viewport, and popup from Base UI. A direct `DrawerContent` child is required between the optional header and footer. It uses Base UI Drawer.Content to preserve text selection while the drawer supports swiping. Set `showSwipeHandle` on `Drawer` to include the drag handle. For lower-level control, `DrawerPortal`, `DrawerOverlay`, and `DrawerSwipeHandle` are also exported.

```text
Drawer
├── DrawerTrigger
└── DrawerPanel
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    ├── DrawerContent
    └── DrawerFooter
```

## Migrating from Vaul

The base drawer now uses [Base UI](https://base-ui.com/react/components/drawer)

instead of Vaul. If you installed the previous base drawer, update your usage

to the Base UI API.

Use `down` instead of `bottom`, and `up` instead of `top`. `left` and `right`

stay the same.

For `DrawerTrigger`, pass the trigger element to the `render` prop.

For `DrawerClose`, pass the close element to the `render` prop.

If you use snap points, rename the controlled snap point props and the sequential

snap point prop.

Vaul props like `handleOnly`, `repositionInputs`, and

`shouldScaleBackground` do not have one-to-one replacements in the base drawer

API. Use Base UI props such as `disablePointerDismissal`, `modal`, `snapPoints`,

or controlled `open` state for the behavior you need.

Replace Vaul's `data-vaul-drawer-direction` selectors with Base UI's

`data-swipe-direction` selectors.

Base UI also exposes attributes like `data-swiping`, `data-starting-style`, and

`data-ending-style` for swipe and transition states. Descendants inside

`DrawerPanel` can use `group-data-[swipe-axis=x]/drawer-popup` and

`group-data-[swipe-axis=y]/drawer-popup` for axis-specific styling.
