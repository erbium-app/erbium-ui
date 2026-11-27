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

## Layout

The field centres itself in the width available. A vertical `Field` or `field.Field`
that holds one centres its label, description and error with it. To start-align a
field on its own, pass `className="mx-0 justify-start"`.

## Validation with TanStack Form and Effect Schema

Base UI's `validationType="numeric"` filters characters; it does not verify the code.
Validate with an Effect Schema passed through `Schema.toStandardSchemaV1` as a
TanStack Form `validators.onChange`, or use `onChangeAsync` for server verification,
so every value change is checked. `onValueComplete` and `autoSubmit` only react to
completion transitions and complete pastes, so they do not recheck every edit to an
already complete code.

`field.OTPField` from the [Form](/docs/components/form) module binds the value, change
and blur handlers, and passes the field's metadata to `OTPField`'s `validation` prop.
The prop accepts the structural subset `isValid`, `isValidating`, `isTouched`, and
`isDirty`, so `OTPField` itself has no TanStack dependency. Pending validation takes
priority, then invalid touched state, then a complete valid value matching
`verifiedValue`. `isValid` alone means that no validation error is recorded; it does
not mean async verification has finished. Set `verifiedValue` only after verification
succeeds, and clear it on every edit. Async verifiers must check their abort signal
before publishing a successful value.
The field stays editable in every validation state; set `readOnly` explicitly when needed.

```tsx
import { Schema } from "effect";

const DemoCode = Schema.toStandardSchemaV1(
  Schema.String.check(
    Schema.makeFilter((code) =>
      code.length < 6 || code === "123456" ? undefined : "Incorrect code.",
    ),
  ),
);

const CompleteCode = Schema.toStandardSchemaV1(
  Schema.String.check(Schema.isMinLength(6, { message: "Enter all 6 digits." })),
);

<form.AppField name="code" validators={{ onChange: DemoCode, onSubmit: CompleteCode }}>
  {(field) => (
    <field.Field>
      <FieldLabel>Verification code</FieldLabel>
      <field.OTPField length={6} groups={[3, 3]} />
      <field.FieldError />
    </field.Field>
  )}
</form.AppField>;
```

Create the form with `useAppForm` and render it in `Form`. `field.Field` binds
`invalid`, `touched`, and `dirty` to the field, and `field.FieldError` shows its
messages once it is touched. The blur handler marks the field touched only when focus
leaves the whole OTP group. `form.SubmitButton` follows `isSubmitting` and
`isSubmitSuccessful`; read other submission state through `form.Subscribe`. A valid
field is separate from a successfully submitted form.
