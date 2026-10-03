---
title: "Validation And Errors"
story: ValidationAndErrors
---

- Add `invalid` to `Field` (Base UI `Field.Root`) to switch the entire block into an error state. Controls inside it receive `aria-invalid` and `data-invalid` automatically.

- With TanStack Form, pass `invalid={!field.state.meta.isValid}` and `errors={field.state.meta.errors}` to `FieldError`.

- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

```tsx
<Field invalid>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" />
  <FieldError match>Enter a valid email address.</FieldError>
</Field>
```
