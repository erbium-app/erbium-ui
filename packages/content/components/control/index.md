---
title: "Control"
description: "Compact controls for settings and sidebars."
---

## Usage

A compact family of controls for sidebars and settings pages. Every row uses the Erbium control surface. Import `Control` from `@erbium/ui/components/control` and compose its members inside `Control.Group` or `Control.Section`.

Each member is one explicit kind of row:

| Member                | Row                                                                       |
| --------------------- | ------------------------------------------------------------------------- |
| `Number`              | A slider drawn as the row, with a typed value editor.                     |
| `Text`, `Textarea`    | A text field.                                                             |
| `Toggle`, `Switch`    | An on/off choice, as Off/On segments or as a switch.                      |
| `Segmented`, `Select` | One of a few options, as segments or a menu.                              |
| `Action`              | A button.                                                                 |
| `Row`                 | A label and any content. `ImageSelect` and `ImageUpload` compose into it. |

Parts inside `Control.Row` take their accessible name from the row's label.

## Number rows

`Control.Number` is a slider drawn as a full-width row: drag anywhere on it, use the arrow keys, or click the value to type an exact number. It is built on the [unstyled Slider](/docs/react/slider) (`@erbium-ui/react/slider`), so these props behave the same in both:

| Prop    | Description                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `step`  | The grid values snap to. Defaults to 1 on a linear row. A fine step such as `0.01` drags almost freely.                       |
| `steps` | Allowed values, including uneven intervals. Replaces `min`, `max` and `step`.                                                 |
| `scale` | `"linear"` (default), `"log"` for ranges across orders of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`. |
| `marks` | Dots for each allowed value: each of `steps`, or each step of a grid of ten or fewer.                                         |

Use `Slider` instead when the value needs labelled marks, more than one thumb, or a vertical track.
