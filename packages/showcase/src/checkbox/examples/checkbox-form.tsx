import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { Form, useAppForm } from "@erbium/ui/components/form";

export default function CheckboxFormExample() {
  const form = useAppForm({
    defaultValues: { newsletter: false, terms: false },
  });

  return (
    <Form form={form} className="flex w-72 flex-col gap-group">
      <form.AppField
        name="terms"
        validators={{
          onDynamic: ({ value }) => (value ? undefined : "Accept the terms to continue."),
        }}
      >
        {(field) => <field.CheckboxField label="Accept terms and conditions" required showError />}
      </form.AppField>
      <form.AppField name="newsletter">
        {(field) => <field.CheckboxField label="Subscribe to the newsletter" />}
      </form.AppField>
      <form.SubmitButton className="self-start">Submit</form.SubmitButton>
      <form.Subscribe
        selector={(state) =>
          state.isSubmitSuccessful && !state.isSubmitting ? state.values : undefined
        }
      >
        {(values) =>
          values && (
            <CodeBlock
              code={JSON.stringify(values, null, 2)}
              language="json"
              title="Submitted values"
            />
          )
        }
      </form.Subscribe>
    </Form>
  );
}
