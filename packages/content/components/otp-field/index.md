---
title: "OTP Field"
description: "Enter and verify a one-time code."
---

Accessible one-time password field built on Base UI's [OTP Field](https://base-ui.com/react/components/otp-field).

**Import:** `@erbium/ui/components/otp-field`

## Usage

```tsx
import { OTPField } from "@erbium/ui/components/otp-field";

<OTPField aria-label="One-time password" length={6} groups={[3, 3]} />;
```

## Composition

Without children the field renders `length` inputs. Pass children to compose them yourself:

```text
OTPField
├── OTPFieldGroup
│   └── OTPFieldInput (×n)
├── OTPFieldSeparator
└── OTPFieldGroup
```

Slots after the first need an `aria-label` such as `Character 2 of 6` when composed by hand.

## Validation and TanStack Form

Base UI's `validationType="numeric"` filters characters; it does not verify the code.
Use TanStack Form's `validators.onChange` or `onChangeAsync` for verification on every
value change. `onValueComplete` and `autoSubmit` only react to completion transitions
and complete pastes, so they do not recheck every edit to an already complete code.

Pass `field.state.meta` to `OTPField`'s `validation` prop. It accepts the structural
subset `isValid`, `isValidating`, `isTouched`, and `isDirty`, without requiring a
TanStack dependency in the UI component. Pending validation takes priority, then
invalid touched state, then a complete valid value matching `verifiedValue`.
`isValid` alone means that no validation error is recorded; it does not mean async
verification has finished. Set `verifiedValue` only after verification succeeds,
and clear it on every edit. Async verifiers must check their abort signal before
publishing a successful value.
The field stays editable in every validation state; set `readOnly` explicitly when needed.

Use the same composition for future form controls:

```tsx
<form.Field
  name="code"
  validators={{
    onChange: ({ value }) =>
      value.length === 6 && value !== "123456" ? "Incorrect code." : undefined,
    onSubmit: ({ value }) => (value.length !== 6 ? "Enter all 6 digits." : undefined),
  }}
>
  {(field) => (
    <Field
      name={field.name}
      invalid={field.state.meta.isTouched && !field.state.meta.isValid}
      touched={field.state.meta.isTouched}
      dirty={field.state.meta.isDirty}
    >
      <FieldLabel>Verification code</FieldLabel>
      <OTPField
        length={6}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) field.handleBlur();
        }}
        validation={field.state.meta}
      />
      <FieldError errors={field.state.meta.isTouched ? field.state.meta.errors : []} />
    </Field>
  )}
</form.Field>
```

Import `Field`, `FieldLabel`, and `FieldError` from `@erbium/ui/components/field`.
Use `noValidate` on the form and call `form.handleSubmit()` from its submit handler.
Controlled `invalid`, `touched`, and `dirty` props keep the field aligned with TanStack Form. The root blur
handler marks the field touched only when focus leaves the whole OTP group.
Read `canSubmit`, `isSubmitting`, and `isSubmitted` through `form.Subscribe` for
submission UI; a valid field is separate from a successfully submitted form.
