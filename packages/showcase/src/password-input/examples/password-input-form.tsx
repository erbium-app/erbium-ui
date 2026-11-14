import { Effect, Schema } from "effect";
import { useState } from "react";
import { FieldGroup } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { Card, CardContent, CardDescription, CardHeader } from "@erbium/ui/components/card";

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

const SignIn = Schema.Struct({
  email: Signup.fields.email,
  password: Schema.String.check(Schema.isNonEmpty({ message: "Enter your password." })),
});

const defaultValues = { confirmPassword: "", email: "", password: "" };

const PasswordInputForm = () => {
  const [signingIn, setSigningIn] = useState(false);
  // One visibility for both fields, so a reveal shows the two values side by side.
  const [visible, setVisible] = useState(false);

  const form = useAppForm({
    defaultValues,
    onSubmit: async () => {
      // Stands in for the request that creates the account.
      await Effect.runPromise(Effect.sleep("450 millis"));
    },
    validators: { onDynamic: Schema.toStandardSchemaV1(Signup) },
  });

  const signIn = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onDynamic: Schema.toStandardSchemaV1(SignIn),
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <h2 className="text-subtitle">{signingIn ? "Sign in" : "Create an account"}</h2>
        <CardDescription>
          {signingIn ? "Enter your email and password." : "Enter your email and choose a password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {signingIn ? (
          <Form form={signIn}>
            <FieldGroup>
              <signIn.AppField name="email">
                {(field) => (
                  <field.TextField label="Email" type="email" autoComplete="username" required />
                )}
              </signIn.AppField>
              <signIn.AppField name="password">
                {(field) => (
                  <field.PasswordField label="Password" autoComplete="current-password" required />
                )}
              </signIn.AppField>
              <signIn.SubmitButton successLabel="Signed in">Sign in</signIn.SubmitButton>
            </FieldGroup>
          </Form>
        ) : (
          <Form form={form}>
            <FieldGroup>
              <form.AppField name="email">
                {(field) => (
                  <field.TextField label="Email" type="email" autoComplete="email" required />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    autoComplete="new-password"
                    required
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
                    required
                    visible={visible}
                    onVisibleChange={setVisible}
                  />
                )}
              </form.AppField>
              <form.SubmitButton successLabel="Account created">Create account</form.SubmitButton>
            </FieldGroup>
          </Form>
        )}
        <p className="mt-4 text-center text-caption text-muted-foreground">
          {signingIn ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-link hover:underline"
            onClick={() => {
              setSigningIn(!signingIn);
              setVisible(false);
              form.reset();
              signIn.reset();
            }}
          >
            {signingIn ? "Create an account" : "Sign in"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
};

export default PasswordInputForm;
