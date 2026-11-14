# UI conventions

- `packages/ui` is the source of truth for reusable components and styles.
- Follow the existing shadcn component patterns and preserve RTL support.
- Keep application-specific composition in `apps/`; do not duplicate shared primitives there.

# Font smoothing

- `html` opts into `antialiased` in `packages/ui/src/styles/base.css`; do not repeat the utility on individual components.
- macOS renders light text on dark surfaces heavier by default, so global grayscale antialiasing keeps type at its designed weight in dark themes.
- Opt a light surface back into the browser default with `subpixel-antialiased` when it sits inside a dark shell (see `.showcase-content.light`), because dark-on-light text relies on the thicker default rendering.
- Avoid body text at weight 300 or below on dark surfaces; grayscale antialiasing renders it lighter than designed, especially on 1x displays.

# Gradients

- Use eased stops for any gradient that fades to transparent so the fade has no hard edge.
- For background gradients, add `gradient-ease-in-out` (from the `easing-gradients` plugin) to `bg-linear-*` with `from-*` and `to-*`, e.g. `bg-linear-to-b from-background to-transparent gradient-ease-in-out`.
- The plugin only eases `background-image` stops. For masks and custom gradients, write the eased stops by hand.

# Form fields and validation feedback

- `FormField` (`field.Field` in `packages/ui/src/components/form.tsx`) owns the rejected-submit shake for every bound and hand-composed field. Do not call `shake()` or add a shake hook inside individual field components or showcase examples.
- The shake targets the field's control: each direct child of the field root except `FieldLabel`, `FieldDescription`, `FieldError`, `FieldContent` and hidden helpers. Keep the control a direct child of `field.Field`; a wrapper around label and control makes the wrapper shake.
- A choice row (see below) shakes as a whole. Override with `shakeOn="control" | "field"` only when the default is wrong for a layout.
- Compose controls without a bound component (Select, RadioGroup, Autocomplete, Date Picker) inside `field.Field` plus `field.FieldError`, never inside the plain `Field`, or they lose the invalid state and the shake.

# Choice control alignment

- Checkbox, RadioGroupItem and Switch carry `data-choice`. A horizontal `Field` or `FieldItem` with a `[data-choice]` child and a direct `FieldLabel` or `FieldContent` matches the `choice-row` variant (`packages/ui/src/styles/variants.css`), which top-aligns the row and applies `choice-first-line` (`packages/ui/src/styles/sizing.css`) to centre the control on the label's first line.
- The offset is derived from `--text-control`, `--text-control--line-height` and the control height (`--choice-size`, or `--choice-height` for a control of another height). Never hand-tune it with `mt-*`, `translate-y-*` or `items-start` on rows or controls.
- A new choice-like control adds `data-choice` and, when it is not `--choice-size` tall, sets `--choice-height` to its height. Size it from that variable so the height has one source.
