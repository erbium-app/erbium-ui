---
title: "Select"
description: "Choose an option from a dropdown list."
---

## Usage

Open a list of selectable options from a button trigger.

**Import:** `@erbium/ui/components/select`

## Usage

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
```

```tsx
const items = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
]

<Select items={items}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

## Composition

Use the following composition to build a `Select`:

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   ├── SelectItem
    │   └── SelectItem
    ├── SelectSeparator
    └── SelectGroup
        ├── SelectLabel
        ├── SelectItem
        └── SelectItem
```

## Current interaction contract

The root forwards Base UI's current props and event details. Let the primitive own focus, matching, and keyboard navigation instead of duplicating them in application handlers.

Multiple values accept readonly arrays. Keep Select for choosing from a finite list without an editable query; use Combobox for a searchable value picker and searchable menus for actions.

Popup retention is explicit: `actionsRef` alone does not keep the popup mounted. Only call `details.preventUnmountOnClose()` in `onOpenChange` when the application owns delayed cleanup, then call `actionsRef.current?.unmount()` when that work completes. Let popups unmount normally by default; retaining every popup adds unnecessary lifetime and state.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.
