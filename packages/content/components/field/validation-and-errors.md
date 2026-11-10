---
title: "Validation And Errors"
story: ValidationAndErrors
---

- Add `invalid` to `Field` (Base UI `Field.Root`) to switch the entire block into an error state. Controls inside it receive `aria-invalid` and `data-invalid` automatically.

- `FieldError` takes its messages as `errors`, a list of strings. In a TanStack Form, use `field.Field` and `field.FieldError` from the [Form](/docs/components/form) module instead: they bind `invalid`, `touched`, and `dirty`, and decode the field's errors, including Effect Schema issues, into messages.

- `FieldDescription` renders only while the field is valid. Compose it with `FieldError` in the same field: the error replaces the helper information, including its accessible description. This also applies to `FieldSet` and descriptions inside `FieldContent`.

- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

```tsx
<Field invalid>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" />
  <FieldDescription>We will use this to contact you.</FieldDescription>
  <FieldError match>Enter a valid email address.</FieldError>
</Field>
```
