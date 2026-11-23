import { Form, useAppForm } from "@erbium/ui/components/form";
import { Button } from "@erbium/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";

export default function FieldResponsiveExample() {
  const form = useAppForm({ defaultValues: { name: "" } });

  return (
    <div className="w-full max-w-lg">
      <Form form={form}>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldGroup>
            <form.AppField
              name="name"
              validators={{
                onDynamic: ({ value }) => (value.trim() ? undefined : "Enter your name."),
              }}
            >
              {(field) => (
                <field.TextField
                  orientation="responsive"
                  label="Name"
                  placeholder="Alex Smith"
                  autoComplete="name"
                  required
                />
              )}
            </form.AppField>
            <Field orientation="horizontal">
              <form.SubmitButton>Submit</form.SubmitButton>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                }}
              >
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Form>
    </div>
  );
}
