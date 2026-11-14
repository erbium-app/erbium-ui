---
title: Form
description: "Manage form state, validation, and submission."
---

## Usage

Forms use [TanStack Form](https://tanstack.com/form/latest) for state and submission and [Effect Schema](https://effect.website/docs/schema/introduction/) for validation. `@erbium/ui/components/form` binds the two to Erbium's fields, so a form is a schema, a `useAppForm` call, and one `form.AppField` per value.

**Import:** `@erbium/ui/components/form`

```tsx
import { Schema } from "effect";
import { Form, useAppForm } from "@erbium/ui/components/form";

const Signup = Schema.Struct({
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
  ),
  name: Schema.Trim.check(Schema.isNonEmpty({ message: "Enter your name." })),
});

const SignupForm = () => {
  const form = useAppForm({
    defaultValues: { email: "", name: "" },
    validators: { onDynamic: Schema.toStandardSchemaV1(Signup) },
    onSubmit: async ({ value }) => {
      const signup = Schema.decodeUnknownSync(Signup)(value);
      await save(signup);
    },
  });

  return (
    <Form form={form}>
      <form.AppField name="name">{(field) => <field.TextField label="Name" />}</form.AppField>
      <form.AppField name="email">
        {(field) => <field.TextField label="Email" type="email" />}
      </form.AppField>
      <form.SubmitButton successLabel="Saved">Sign up</form.SubmitButton>
    </Form>
  );
};
```

## Validation

Write validation as an Effect Schema and pass it through `Schema.toStandardSchemaV1`. TanStack Form accepts any Standard Schema, so the same schema validates the whole form (`useAppForm({ validators })`) or one field (`form.AppField validators`). Messages come from the schema: a `message` on a check such as `Schema.isNonEmpty({ message })`, an `annotate({ message })` on a type, or the `issue` of a `Schema.makeFilter` that spans fields. Give the filter issue a `path` to place it on a field.

`useAppForm` defaults to `revalidateLogic()`, so put the schema in `validators.onDynamic`: nothing is checked until the first submit, then every change revalidates and fixing a value clears its error immediately. Pass your own `validationLogic` to change that. Field-level `onChange`, `onBlur`, and `onSubmit` validators keep their usual TanStack behavior.

TanStack Form passes the encoded values to `onSubmit`. Decode them with the same schema to get its output type, for example trimmed strings. On the server, decode the request with the same schema.

## Fields

Inside `form.AppField`, the `field` render argument carries Erbium's bound components:

| Component             | Use                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------- |
| `field.TextField`     | Label, `Input`, description, and error for a string.                                    |
| `field.PasswordField` | Label, `PasswordInput`, description, and error for a password string.                   |
| `field.TextareaField` | Label, `Textarea`, description, and error for a string.                                 |
| `field.CheckboxField` | `Checkbox` with its label and description for a boolean.                                |
| `field.SwitchField`   | `Switch` after its label and description for a boolean.                                 |
| `field.OTPField`      | `OTPField` bound to a string. Validation drives its pending, error, and success states. |
| `field.Field`         | `Field` with `name`, `invalid`, `touched`, and `dirty` bound, for your own composition. |
| `field.FieldError`    | `FieldError` showing the field's messages.                                              |

Use `field.PasswordField` for passwords rather than `field.TextField` with `type="password"`: it adds the show and hide toggle, and pressing the toggle does not touch the field. See [Password Input](/docs/components/password-input).

A field shows its errors only after it is touched; typing, blurring, and submitting all touch it. Errors are decoded from strings or Standard Schema issues, so Effect Schema messages and plain validator strings render the same way. `FieldDescription` steps aside while an error shows. Each rejected submit shakes the invalid controls.

A toggle that must be on, such as accepting terms, needs no error text: its label already says what is expected, and the invalid outline plus the shake say it is required. `CheckboxField` and `SwitchField` therefore shake the control together with its label and keep the message for assistive technology only. Pass `showError` to show it.

Compose a custom field from `field.Field`, `field.FieldError`, and your own control:

```tsx
<form.AppField name="code" validators={{ onSubmit: Schema.toStandardSchemaV1(Code) }}>
  {(field) => (
    <field.Field>
      <FieldLabel>Verification code</FieldLabel>
      <field.OTPField length={6} groups={[3, 3]} />
      <field.FieldError />
    </field.Field>
  )}
</form.AppField>
```

## Submission

`Form` renders the native `<form>` with `noValidate`, submits through `form.handleSubmit()`, and provides the form to `form.SubmitButton`. `form.SubmitButton` is a `StatefulButton` that shows loading while the form submits and success after a submit that passed validation.

Add your own bound components with `extendForm({ fieldComponents, formComponents })` and read the field inside them with `useFieldContext`. The questionnaire binding, `useQuestionnaireForm` and `QuestionnaireForm` in `@erbium/ui/components/questionnaire`, is built this way.

For application examples, use `useAppForm` for submitted values, validation, and submit status. Use bound fields where available. For controls such as Select and Date Picker, compose `field.Field` and `field.FieldError`, connect the control to `field.state.value` and `field.handleChange`, and call `field.handleBlur` when the control loses focus. Keep navigation in the router and view-only state, such as a dialog's open state, in the surrounding component.
