---
title: "Item"
description: "A content row with media and actions."
---

## Usage

Compose content rows with media, a title, a description, and actions. Use the default variant for flat rows or `variant="card"` for standalone cards.

**Import:** `@erbium/ui/components/item`

## Usage

```tsx
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";
```

```tsx
<Item>
  <ItemMedia variant="icon">
    <Icon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Title</ItemTitle>
    <ItemDescription>Description</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button>Action</Button>
  </ItemActions>
</Item>
```

## Composition

Use the following composition to build an `Item`:

```text
ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter
```

## Item vs Field

Use `Field` when you need form layout and validation semantics. `Item` can also lay out a settings row when its control is separately labeled. Use `ItemGroup variant="panel"` for a shared panel surface with inset dividers.
