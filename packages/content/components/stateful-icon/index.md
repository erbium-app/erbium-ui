---
title: "Stateful Icon"
description: "Animated icons that reflect changing states."
---

Import from `@erbium/ui/components/stateful-icon`.

| Component           | Use it for                                                                  |
| ------------------- | --------------------------------------------------------------------------- |
| `StatefulIcon`      | Swapping the content of one slot, such as copy and check or play and pause. |
| `RotatingChevron`   | The open state of a disclosure trigger or submenu.                          |
| `CheckboxStateIcon` | The check and mixed marks of a checkbox surface.                            |

## StatefulIcon

Pass the current `state` and the content for every state. Changing `state` crossfades between them. Reduced-motion preferences swap them at once.

```tsx
<Button aria-label={playing ? "Pause" : "Play"} size="icon">
  <StatefulIcon
    state={playing ? "pause" : "play"}
    icons={{ pause: <Icon name="pause" />, play: <Icon name="play" /> }}
  />
</Button>
```

The icon is decorative, so name the control around it. It accepts the other `span` props, such as `data-icon` for button spacing.

Theme changes suppress transitions while the palette swaps. Add `data-theme-motion` to an icon that should still animate, such as a theme toggle's.

## RotatingChevron

The chevron turns while its trigger has `aria-expanded="true"`. Accordion, Collapsible, Select, Combobox, Cascader, NavigationMenu, DropdownMenu and Popover triggers work as they are, as do submenu triggers. Add `group/disclosure` to a custom trigger.

| Prop        | Values                             | Closed direction                                            |
| ----------- | ---------------------------------- | ----------------------------------------------------------- |
| `direction` | `"down"` (default), `"inline-end"` | Down for content below, toward the inline end for submenus. |

## Checkbox state

Checkbox, DropdownMenuCheckboxItem, ContextMenuCheckboxItem, and MenubarCheckboxItem share `CheckboxStateIcon`. Checking draws the mark with the same timing everywhere; indeterminate fields show the mixed-selection mark. Reduced-motion preferences show the final state immediately. Consumers of these components get the animation automatically.

When implementing another checkbox surface, keep its primitive indicator mounted and give it `group/check-indicator`. Place CheckboxStateIcon inside it so the primitive's `data-checked` and `data-indeterminate` attributes drive the animation. The icon is decorative; the checkbox primitive owns its accessible state. Do not replace the primitive with a clickable icon or add a second checked-state context.
