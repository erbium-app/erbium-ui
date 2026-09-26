// @ts-nocheck
import { useForm } from "../components/form";
import { Button } from "../components/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../components/field";
import { Input } from "../components/input";

export default function FormDemo() {
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => window.alert(`Submitted: ${value.email}`),
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="w-80 space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) => (value.includes("@") ? undefined : "Enter a valid email address."),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldDescription>We will use this to contact you.</FieldDescription>
            {field.state.meta.errors.map((error) => (
              <FieldError key={String(error)}>{error}</FieldError>
            ))}
          </Field>
        )}
      </form.Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
