---
title: "Custom Sizes"
story: CustomSizes
---

The drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)` by default. To customize its height, use the `h-*` and `max-h-*` utilities on `DrawerPanel`.

To make a region of the drawer scrollable, make the scroll container a flex item. Avoid `h-full`, which does not resolve inside a content-sized drawer.

```tsx
<DrawerPanel className="h-[50vh]">
```

```tsx
<DrawerPanel className="max-h-[50vh]">
```

```tsx
<DrawerPanel>
  <DrawerHeader>...</DrawerHeader>
  <DrawerContent>{/* Scrollable content */}</DrawerContent>
  <DrawerFooter>...</DrawerFooter>
</DrawerPanel>
```
