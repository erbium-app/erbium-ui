---
title: "Drawer"
description: "A bottom sheet for supporting content."
---

A bottom sheet for supporting content. It rises from the bottom edge and is dismissed by swiping down.

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

## Page indent

`DrawerIndent` scales the page back behind an open drawer, rounds its visible part, and follows the swipe as the drawer is dismissed. It needs a `DrawerProvider` above both the indent and the drawers, so the indent knows when any drawer is open. Drawers work without a provider; they only skip the indent.

```tsx
import { DrawerIndent, DrawerProvider } from "@erbium/ui/components/drawer";

<DrawerProvider>
  <DrawerIndent>{/* the app */}</DrawerIndent>
</DrawerProvider>;
```

Mount both once, around the app. [App Shell](/docs/blocks/app-shell) already mounts them. A nested `DrawerProvider` joins the outer one, so drawers inside it still drive the app's indent.

While a drawer is open the indent's transform makes it the containing block for fixed descendants. Keep fixed chrome outside it, or offset it with `top-(--drawer-indent-top,0px)`: the scroll offset of the page, which the indent holds until the page is back at rest.

## Migrating from Vaul

The base drawer now uses [Base UI](https://base-ui.com/react/components/drawer)

instead of Vaul. If you installed the previous base drawer, update your usage

to the Base UI API.

The drawer opens from the bottom only. Remove Vaul's `direction` prop.

For `DrawerTrigger`, pass the trigger element to the `render` prop.

For `DrawerClose`, pass the close element to the `render` prop.

If you use snap points, rename the controlled snap point props and the sequential

snap point prop.

Vaul props like `handleOnly`, `repositionInputs`, and

`shouldScaleBackground` do not have one-to-one replacements in the base drawer

API. Use Base UI props such as `disablePointerDismissal`, `modal`, `snapPoints`,

or controlled `open` state for the behavior you need.

Replace `shouldScaleBackground` and Vaul's `[vaul-drawer-wrapper]` with

`DrawerProvider` and `DrawerIndent`.

Base UI also exposes attributes like `data-swiping`, `data-starting-style`, and

`data-ending-style` for swipe and transition states.

## Search, touch controls, and the keyboard

Keep search inside its own result surface using Command or an inline AutocompleteSearchInput. Search rows stay flush and use the shared separator; do not add an inset field shell. DrawerContent already owns content scrolling, while header and footer remain outside it.

Bottom drawers already integrate Base UI's virtual keyboard provider. Avoid adding another provider or compensating for the keyboard with custom viewport calculations. Let the drawer coordinate keyboard dismissal, scrolling, and item taps.

A modal drawer pauses the page's hotkeys while it is open, as a modal dialog does; hotkeys registered inside the panel keep working. With `modal={false}`, the page's hotkeys stay active.

Use `data-base-ui-swipe-ignore` on an interaction that must fully opt out of drawer swipes. For a touch control that only handles one axis, use `"x"` or `"y"` so the other axis can still swipe the drawer. Place this marker on the control, not the entire content area. The SearchAndControls story demonstrates a horizontal slider beside a searchable list. Real-device checks are still needed for swipe velocity and virtual keyboard behavior.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.

The panel owns the surface. Header and footer own their padding; Content owns body padding and the single body scroll viewport. Do not add a ScrollArea or duplicate panel gutters inside Content. Independently scrolling search results belong beside Content, directly in the panel.
