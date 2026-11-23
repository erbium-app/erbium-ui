import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { Form, useAppForm } from "@erbium/ui/components/form";

const plans = [
  { label: "Starter", value: "starter" },
  { label: "Team", value: "team" },
  { label: "Enterprise", value: "enterprise" },
] as const;

export default function SegmentedControlFormExample() {
  const form = useAppForm({ defaultValues: { plan: "" } });

  return (
    <Form form={form} className="flex w-80 flex-col gap-group">
      <form.AppField
        name="plan"
        validators={{ onDynamic: ({ value }) => (value ? undefined : "Choose a plan.") }}
      >
        {(field) => (
          <field.SegmentedField
            label="Plan"
            description="You can change plans at any time."
            options={plans}
            required
          />
        )}
      </form.AppField>
      <form.SubmitButton className="self-start">Continue</form.SubmitButton>
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
