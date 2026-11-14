import { Form, useAppForm } from "@erbium/ui/components/form";
import { Button } from "@erbium/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@erbium/ui/components/field";

const FieldResponsive = () => {
  const form = useAppForm({ defaultValues: { name: "", message: "" } });

  return (
    <div className="w-full max-w-4xl">
      <Form form={form}>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldSeparator />
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
            <FieldSeparator />
            <form.AppField
              name="message"
              validators={{
                onDynamic: ({ value }) => (value.trim() ? undefined : "Enter a message."),
              }}
            >
              {(field) => (
                <field.TextareaField
                  orientation="responsive"
                  label="Message"
                  placeholder="Hello, world!"
                  required
                />
              )}
            </form.AppField>
            <FieldSeparator />
            <Field orientation="responsive">
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
};

export default FieldResponsive;
