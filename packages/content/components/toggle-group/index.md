---
title: "Toggle Group"
description: "A set of two-state buttons that can be toggled on or off."
---

A set of two-state buttons that can be toggled on or off.

**Import:** `@erbium/ui/components/toggle-group`

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
```

```tsx
<ToggleGroup>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
</ToggleGroup>
```

## Composition

Use the following composition to build a `ToggleGroup`:

```text
ToggleGroup
├── ToggleGroupItem
└── ToggleGroupItem
```

## Changelog

Changed the default `spacing` from `0` to `2` so toggle groups render with space between items by default. Use `spacing={0}` for connected items.

Use `multiple` to allow more than one selected item. Controlled values are arrays passed through `value` and updated with `onValueChange`.
