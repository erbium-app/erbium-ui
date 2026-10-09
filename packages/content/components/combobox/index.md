---
title: "Combobox"
description: "Search and select from suggested options."
---

Search and select from suggested options.

**Import:** `@erbium/ui/components/combobox`

## Usage

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@erbium/ui/components/combobox";
```

```tsx
const frameworks = ["TanStack Start", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function ExampleCombobox() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

## Composition

A single-line input and a flat list (see [Basic](#basic)).

Multi-select with `multiple`, chips, and a chips input (see [Multiple](#multiple)).

Nested items per group using `ComboboxCollection` inside each `ComboboxGroup`, with a separator between groups (see [Groups](#groups)).

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

```text
Combobox
├── ComboboxChips
│   ├── ComboboxValue
│   │   └── ComboboxChip
│   └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxItem
        └── ComboboxItem
```

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxCollection
        │       ├── ComboboxItem
        │       └── ComboboxItem
        ├── ComboboxSeparator
        └── ComboboxGroup
            ├── ComboboxLabel
            └── ComboboxCollection
                ├── ComboboxItem
                └── ComboboxItem
```

## Current interaction contract

The root forwards Base UI's current props and event details. Let the primitive own focus, matching, and keyboard navigation instead of duplicating them in application handlers.

Use `createComboboxItems(data, { getValue, getLabel })` for object collections whose selected values should be IDs. The collection preserves source objects for List rendering and resolves trigger labels even when items are unmounted. Create static collections at module scope; memoize collections derived from changing data. Multiple selection accepts readonly value arrays; copy values when modifying them.

Use `ComboboxSearchInput` inside a popup. Its flush row and full-width separator match Command and searchable menus. `ComboboxInput` remains the standalone field recipe. Use `autoHighlight` for query-driven pickers; results arriving asynchronously participate in highlighting.

`onItemHighlighted(item, details)` can drive a contextual preview. The originating event is available in `details.event`; pointer interactions can report MouseEvent or PointerEvent, while typing can report the reason `none`. Do not assume highlighting means selection.

Popup retention is explicit: `actionsRef` alone does not keep the popup mounted. Only call `details.preventUnmountOnClose()` in `onOpenChange` when the application owns delayed cleanup, then call `actionsRef.current?.unmount()` when that work completes. Let popups unmount normally by default; retaining every popup adds unnecessary lifetime and state.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.
