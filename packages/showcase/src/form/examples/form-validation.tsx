import { Effect, Schema } from "effect";
import { useState } from "react";
import { FieldGroup } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";

/** One schema validates the form in the browser and the request on the server. */
const ContactRequest = Schema.Struct({
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
  ),
  message: Schema.String.check(
    Schema.isMinLength(20, { message: "Write at least 20 characters so we can help." }),
  ),
  name: Schema.Trim.check(Schema.isNonEmpty({ message: "Enter your name." })),
  terms: Schema.Literal(true).annotate({ message: "Accept the terms to continue." }),
  updates: Schema.Boolean,
});

const defaultValues = {
  email: "",
  message: "",
  name: "",
  terms: false,
  updates: true,
};

const FormValidation = () => {
  const [sent, setSent] = useState("");

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // The submitted values passed validation, so decoding applies the
      // schema's transformations, e.g. trimming the name.
      const contact = Schema.decodeUnknownSync(ContactRequest)(value);
      // Stands in for the request that sends the form.
      await Effect.runPromise(Effect.sleep("450 millis"));
      setSent(contact.name);
    },
    validators: { onDynamic: Schema.toStandardSchemaV1(ContactRequest) },
  });

  return (
    <Form form={form} className="w-full max-w-sm">
      <FieldGroup>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="message">
          {(field) => (
            <field.TextareaField
              label="Message"
              description="Tell us what you need help with."
              rows={4}
            />
          )}
        </form.AppField>
        <form.AppField name="updates">
          {(field) => (
            <field.SwitchField
              label="Product updates"
              description="A short email when something ships."
            />
          )}
        </form.AppField>
        <form.AppField name="terms">
          {(field) => <field.CheckboxField label="I accept the terms of service" />}
        </form.AppField>
        <form.SubmitButton successLabel="Sent">Send message</form.SubmitButton>
        {sent ? <output className="block">Thanks, {sent}. We will reply soon.</output> : null}
      </FieldGroup>
    </Form>
  );
};

export default FormValidation;
