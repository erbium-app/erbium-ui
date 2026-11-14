import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import { Form, useAppForm } from "@erbium/ui/components/form";

const RadioGroupForm = () => {
  const form = useAppForm({ defaultValues: { shipping: "" } });

  return (
    <Form form={form} className="flex w-72 flex-col gap-group">
      <form.AppField
        name="shipping"
        validators={{ onDynamic: ({ value }) => (value ? undefined : "Choose a shipping option.") }}
      >
        {(field) => (
          <field.Field>
            <RadioGroup
              aria-label="Shipping speed"
              value={field.state.value}
              onValueChange={field.handleChange}
              onBlur={field.handleBlur}
            >
              <FieldItem orientation="horizontal">
                <RadioGroupItem value="standard" />
                <FieldLabel>Standard (5–7 days)</FieldLabel>
              </FieldItem>
              <FieldItem orientation="horizontal">
                <RadioGroupItem value="express" />
                <FieldLabel>Express (1–2 days)</FieldLabel>
              </FieldItem>
            </RadioGroup>
            <field.FieldError />
          </field.Field>
        )}
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
};

export default RadioGroupForm;
