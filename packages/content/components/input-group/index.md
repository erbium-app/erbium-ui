---
title: "Input Group"
description: "Combines inputs with addons and actions."
---

## Usage

Compose inputs with addons, buttons, and helper content.

**Import:** `@erbium/ui/components/input-group`

## Usage

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";
```

```tsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

## Composition

Use the following composition to build an `InputGroup`:

```text
InputGroup
├── InputGroupInput or InputGroupTextarea
├── InputGroupAddon
├── InputGroupButton
└── InputGroupText
```

For proper focus management, place `InputGroupAddon` after `InputGroupInput` or `InputGroupTextarea` in the DOM. Use `align` to position it visually.

## Loading

Loading marks the group busy without disabling the input.

Spinners beside labels belong at the inline start: left in LTR and right in RTL. Inherit `dir` from the page or set it on a containing element. Loading APIs do not expose a spinner alignment option.

```tsx
<InputGroup loading>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

## Copyable fields

Use [Copy Button](/docs/copy-button) in an inline-end addon. Render it as an `InputGroupButton` with `variant="embedded"` for a flush action that shares the field surface. Pass the current input value to the copy action and give the button a specific accessible name.
