---
title: "Input Group"
description: "Add addons, buttons, and helper content to inputs."
---

Add addons, buttons, and helper content to inputs.

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
