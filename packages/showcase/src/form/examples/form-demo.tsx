import { Effect, Schema } from "effect";
import { useState } from "react";
import { Form, useAppForm } from "@erbium/ui/components/form";

const Email = Schema.String.check(
  Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
);

const OptionalEmail = Schema.Union([Schema.Literal(""), Email]);

const emailForm = (email: typeof Email | typeof OptionalEmail) =>
  Schema.toStandardSchemaV1(Schema.Struct({ email }));

const RequiredEmailForm = emailForm(Email);
const OptionalEmailForm = emailForm(OptionalEmail);

const FormDemo = ({
  defaultEmail = "",
  required = true,
  submitLabel = "Submit",
}: {
  defaultEmail?: string;
  required?: boolean;
  submitLabel?: string;
}) => {
  const [submitted, setSubmitted] = useState("");

  const form = useAppForm({
    defaultValues: { email: defaultEmail },
    onSubmit: async ({ value }) => {
      // Stands in for the request that sends the form.
      await Effect.runPromise(Effect.sleep("450 millis"));
      setSubmitted(value.email);
    },
    validators: { onDynamic: required ? RequiredEmailForm : OptionalEmailForm },
  });

  return (
    <Form form={form} className="w-80 space-y-4">
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            label="Email"
            required={required}
            type="email"
            autoComplete="email"
            description="We will use this to contact you."
          />
        )}
      </form.AppField>
      <form.SubmitButton successLabel="Submitted">{submitLabel}</form.SubmitButton>
      {submitted ? <output className="block">Submitted: {submitted}</output> : null}
    </Form>
  );
};

export default FormDemo;
