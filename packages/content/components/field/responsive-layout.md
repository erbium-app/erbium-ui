---
title: "Responsive Layout"
story: ResponsiveLayout
---

- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.

- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.

- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.
