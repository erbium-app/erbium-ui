---
title: "Button Group"
description: "A container that groups related buttons together with consistent styling."
---

A container that groups related buttons together with consistent styling.

**Import:** `@erbium/ui/components/button-group`

## Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@erbium/ui/components/button-group";
```

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Composition

Use the following composition to build a `ButtonGroup`:

```text
ButtonGroup
├── Button or Input
├── ButtonGroupSeparator
└── ButtonGroupText
```

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.

- Use <Kbd hotkey="Tab" /> to navigate between the buttons in the group.

- Use `aria-label` or `aria-labelledby` to label the button group.

```tsx
<ButtonGroup aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an action.

- Use the `ToggleGroup` component when you want to group buttons that toggle a state.
