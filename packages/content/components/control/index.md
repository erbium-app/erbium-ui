---
title: "Control"
description: "Compact controls for settings and sidebars."
---

## Usage

A compact family of controls for sidebars and settings pages. Every row uses the Erbium control surface. Import `Control` from `@erbium/ui/components/control` and compose its typed members inside `Control.Group` or `Control.Section`.

## Number rows

`Control.Number` is a slider drawn as a full-width row: drag anywhere on it, use the arrow keys, or click the value to type an exact number. It shares its scale code with `Slider` (`@erbium/ui/lib/slider-scale`), so the options below behave the same in both.

| Prop        | Description                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `mode`      | `"discrete"` (default) snaps to `step` or `steps`; `"continuous"` drags freely and accepts any typed number.                  |
| `steps`     | Allowed values in discrete mode, including uneven intervals. Each sits at its own position along the row.                     |
| `showSteps` | Dots for small discrete sets: each of `steps`, or each step when there are ten intervals or fewer.                            |
| `scale`     | `"linear"` (default), `"log"` for ranges across orders of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`. |

Use `Slider` instead when the value needs labelled marks, more than one thumb, or a vertical track.
