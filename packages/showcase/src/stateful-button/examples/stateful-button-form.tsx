import { Effect, Schema } from "effect";
import { Form, useAppForm } from "@erbium/ui/components/form";

const Subscription = Schema.toStandardSchemaV1(
  Schema.Struct({
    email: Schema.String.check(
      Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
    ),
  }),
);

const StatefulButtonForm = () => {
  const form = useAppForm({
    defaultValues: { email: "" },
    onSubmit: async () => {
      // Stands in for the request that subscribes the address.
      await Effect.runPromise(Effect.sleep("1200 millis"));
    },
    validators: { onDynamic: Subscription },
  });

  return (
    <Form form={form} className="w-80 space-y-4">
      <form.AppField name="email">
        {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
      </form.AppField>
      <form.SubmitButton successLabel="Subscribed">Subscribe</form.SubmitButton>
    </Form>
  );
};

export default StatefulButtonForm;
