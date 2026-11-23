---
title: "Responsive Layout"
story: ResponsiveLayout
---

- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.

- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned. A checkbox, radio, or switch beside a `FieldLabel` or `FieldContent` is centred on the label's first line automatically, so it stays in place when the label or description wraps. Do not add `items-start` to the row or a top margin to the control.

- **Responsive fields:** Set `orientation="responsive"` inside a `FieldGroup` to stack the field while the group is narrow and put the label beside the control once the group is at least 28rem wide. The control, description and error share the second column. For a row of buttons, use `orientation="horizontal"`; for any other arrangement, add your own classes to the field.
