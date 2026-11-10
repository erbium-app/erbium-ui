import { Effect, Schema } from "effect";
import { useState } from "react";
import { FieldGroup } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";

/** One schema checks the password and that the confirmation matches it. */
const Signup = Schema.Struct({
  confirmPassword: Schema.String,
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
  ),
  password: Schema.String.check(
    Schema.isMinLength(8, { message: "Use at least 8 characters." }),
    Schema.isPattern(/\d/u, { message: "Include at least one number." }),
  ),
}).check(
  Schema.makeFilter(({ confirmPassword, password }) =>
    confirmPassword === password
      ? undefined
      : { issue: "The passwords do not match.", path: ["confirmPassword"] },
  ),
);

const defaultValues = { confirmPassword: "", email: "", password: "" };

const PasswordInputForm = () => {
  const [created, setCreated] = useState("");
  // One visibility for both fields, so a reveal shows the two values side by side.
  const [visible, setVisible] = useState(false);

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const signup = Schema.decodeUnknownSync(Signup)(value);
      // Stands in for the request that creates the account.
      await Effect.runPromise(Effect.sleep("450 millis"));
      setCreated(signup.email);
    },
    validators: { onDynamic: Schema.toStandardSchemaV1(Signup) },
  });

  return (
    <Form form={form} className="w-full max-w-sm">
      <FieldGroup>
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="Password"
              autoComplete="new-password"
              description="At least 8 characters, including a number."
              visible={visible}
              onVisibleChange={setVisible}
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label="Confirm password"
              autoComplete="new-password"
              visible={visible}
              onVisibleChange={setVisible}
            />
          )}
        </form.AppField>
        <form.SubmitButton successLabel="Account created">Create account</form.SubmitButton>
        {created ? <output className="block">Welcome, {created}.</output> : null}
      </FieldGroup>
    </Form>
  );
};

export default PasswordInputForm;
