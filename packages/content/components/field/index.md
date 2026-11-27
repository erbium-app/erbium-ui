---
title: "Field"
description: "Labels, help text, and errors for form controls."
---

## Usage

Compose labels, controls, help text, and errors for individual fields or grouped inputs.

**Import:** `@erbium/ui/components/field`

## Usage

```tsx
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@erbium/ui/components/field";
```

```tsx
<FieldSet>
  <FieldLegend>Profile</FieldLegend>
  <FieldDescription>This appears on invoices and emails.</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Full name</FieldLabel>
      <Input id="name" autoComplete="off" placeholder="Alex Smith" />
      <FieldDescription>This appears on invoices and emails.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" autoComplete="off" aria-invalid />
      <FieldError>Choose another username.</FieldError>
    </Field>
    <Field orientation="horizontal">
      <Switch id="newsletter" />
      <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Composition

A single control with label, helper text, and validation.

Related fields in one group. Use `FieldSeparator` between sections when needed.

Semantic grouping with a legend and description, usually containing a `FieldGroup`.

```text
Field
├── FieldLabel
├── Input / Textarea / Switch / Select
├── FieldDescription
└── FieldError
```

```text
FieldGroup
├── Field
│   ├── FieldLabel
│   ├── Input / Textarea / Switch / Select
│   ├── FieldDescription
│   └── FieldError
├── FieldSeparator
└── Field
    ├── FieldLabel
    └── Input / Textarea / Switch / Select
```

```text
FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    ├── Field
    │   ├── FieldLabel
    │   ├── Input / Textarea / Switch / Select
    │   ├── FieldDescription
    │   └── FieldError
    └── Field
        ├── FieldLabel
        └── Input / Textarea / Switch / Select
```

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field is structured as follows:

- `Field` is the core wrapper for a single field.

- `FieldContent` is a flex column that groups label and description. Not required if you have no description.

- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.

```tsx
<Field>
  <FieldLabel htmlFor="input-id">Label</FieldLabel>
  {/* Input, Select, Switch, etc. */}
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError>Validation message.</FieldError>
</Field>
```

## Form

See [Form](/docs/components/form) for building forms with the `Field` component, [TanStack Form](https://tanstack.com/form/latest), and [Effect Schema](https://effect.website/docs/schema/introduction/).

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.

- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.

- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.
