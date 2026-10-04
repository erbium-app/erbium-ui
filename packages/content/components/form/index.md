---
title: Form
description: "Manage form state, validation, and submission."
---

## Usage

Import `useForm` from `@tanstack/react-form`. Use `form.Field` for state and validation, then compose the visible control with `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, and an input component. Keep `FieldError` mounted with `errors={field.state.meta.errors}` so validation messages expand smoothly, and connect the input with `aria-describedby`. Validate on blur or change as needed, set `noValidate` on the form, and call `form.handleSubmit()` after preventing the default submit. Use `onSubmitInvalid` to shake invalid controls on every rejected attempt while TanStack Form continues to own error state. See the [Shadcn/ui TanStack Form guide](https://ui.shadcn.com/docs/forms/tanstack-form) for the related upstream pattern.
