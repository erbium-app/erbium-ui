---
title: "Custom Sizes"
story: CustomSizes
---

A vertical drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)` by default. A side drawer spans `75%` of the viewport width, or `24rem` on larger screens.

To customize the height of a vertical drawer, use the `h-*` and `max-h-*` utilities on `DrawerPanel`.

To customize the width of a side drawer, use the `w-*` and `max-w-*` utilities on `DrawerPanel`.

When the same component renders in multiple directions, scope an override to one axis using the `data-[swipe-axis=*]` variants.

To make a region of the drawer scrollable, make the scroll container a flex item. Avoid `h-full`, which does not resolve inside a content-sized drawer.

```tsx
<DrawerPanel className="h-[50vh]">
```

```tsx
<DrawerPanel className="w-96">
```

```tsx
<DrawerPanel className="data-[swipe-axis=y]:max-h-[50vh] data-[swipe-axis=x]:w-96">
```

```tsx
<DrawerPanel>
  <DrawerHeader>...</DrawerHeader>
  <DrawerContent>{/* Scrollable content */}</DrawerContent>
  <DrawerFooter>...</DrawerFooter>
</DrawerPanel>
```
