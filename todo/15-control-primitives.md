# 15 — Control primitives

Reviewed 2026-11-18. Proposed additions to `Control` (`packages/ui/src/components/control.tsx`) so settings sidebars for CRM pages, agent setup and image editing can be built from aligned rows. Names are illustrative, not shipped contracts.

## Current set

`Number` (on `@erbium-ui/react/slider`: steps, scales, marks), `Text`, `Textarea`, `Toggle`, `Switch`, `Segmented`, `Select`, `Action`, `Row` with the `ImageSelect` and `ImageUpload` parts, `Section`, `Group`.

Redesigned on 2026-11-19 with one member per kind of row instead of mode props: `Boolean presentation` became `Toggle` and `Switch`, `Image` became parts composed in `Row`, and `mode` and `showSteps` became `step` and `marks`.

Removed on 2026-11-18: `Color` (fell back to the browser colour picker), `Pad`, `Spring` and `Transition` (motion-tool abstractions with no product use).

Every row is `--control-height` tall. New controls must fit the row's content box (20px on desktop) and must not set their own taller minimum height.

## Layout

- **`Control.Columns`**: two short controls side by side, such as X/Y, W/H or Min/Max. Covers what `Pad` did without the 2D surface.
- **Row hint and reset**: an optional description line under a row, and a reset button that appears when the value differs from its default.
- **Read-only row with copy**: IDs, endpoint URLs, API key prefixes and connection status, with a copy button.

## Choosing values

- **Segments with icons**: `Segmented` options accept an icon, for alignment, view mode or sort direction.
- **Searchable select**: a combobox row for long lists such as owners, pipelines, models or fonts.
- **Multi-select tags**: record tags, allowed domains, stop sequences, assignees.
- **Range**: one row with a min and a max value, for filters such as deal size or a date span.

## Agent surfaces

- **Key-value list**: add and remove pairs for headers, environment variables, metadata or tool parameters.
- **Tool toggle list**: `Boolean` with a description and an optional status badge, for enabling tools or integrations.
- **Select options with descriptions**: model pickers where each option needs a detail line or a badge.

## Image editor

- **Color**: a swatch that opens an Erbium popover with a preset palette, hex input and opacity. Never the native colour input. A CRM may only need the preset palette.
- **Anchor grid**: a 3×3 picker for transform origin or alignment.
- **Angle**: `Number` with degree formatting and wrap-around; no new component.

## Not planned

Curve and spring editors, the XY pad and gradient editors. They serve motion tools, not product settings.

## Order

1. `Control.Columns`, row hint and reset, segments with icons, searchable select and multi-select.
2. Color and the key-value list.
3. The rest as products need them.

## Open question

Whether the image parts stay. It is rare in CRM settings but fits an image editor and avatar or logo settings.
