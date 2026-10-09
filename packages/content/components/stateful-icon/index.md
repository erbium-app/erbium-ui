---
title: "Stateful Icon"
description: "Animated icons that reflect changing states."
---

## Usage

StatefulIcon animates between caller-provided content states. RotatingChevron, ExpandableChevron, SidebarToggleIcon, and ThemeToggleIcon show common state changes. Import from `@erbium/ui/components/stateful-icon`.

## Checkbox state

Checkbox, DropdownMenuCheckboxItem, ContextMenuCheckboxItem, and MenubarCheckboxItem share `CheckboxStateIcon`. Checking draws the mark with the same timing everywhere; indeterminate fields show the mixed-selection mark. Reduced-motion preferences show the final state immediately. Consumers of these components get the animation automatically.

When implementing another checkbox surface, keep its primitive indicator mounted and give it `group/check-indicator`. Place CheckboxStateIcon inside it so the primitive's `data-checked` and `data-indeterminate` attributes drive the animation. The icon is decorative; the checkbox primitive owns its accessible state. Do not replace the primitive with a clickable icon or add a second checked-state context.
