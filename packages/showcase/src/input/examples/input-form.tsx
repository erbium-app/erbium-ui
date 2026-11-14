import { useId } from "react";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { Button } from "@erbium/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";

export const InputForm = () => {
  const countries = [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ];

  const countryId = useId();

  const form = useAppForm({
    defaultValues: { address: "", country: "us", email: "", name: "", phone: "" },
  });

  return (
    <Form form={form} className="w-full max-w-sm">
      <FieldGroup>
        <form.AppField
          name="name"
          validators={{ onDynamic: ({ value }) => (value.trim() ? undefined : "Enter your name.") }}
        >
          {(field) => (
            <field.TextField label="Name" placeholder="Alex Smith" autoComplete="name" required />
          )}
        </form.AppField>
        <form.AppField
          name="email"
          validators={{
            onDynamic: ({ value }) =>
              !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)
                ? undefined
                : "Enter a valid email address.",
          }}
        >
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
            />
          )}
        </form.AppField>
        <div className="grid grid-cols-2 gap-group">
          <form.AppField name="phone">
            {(field) => (
              <field.TextField
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            )}
          </form.AppField>
          <form.AppField name="country">
            {(field) => (
              <field.Field>
                <FieldLabel htmlFor={countryId}>Country</FieldLabel>
                <Select
                  items={countries}
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value ?? "");
                  }}
                >
                  <SelectTrigger id={countryId} onBlur={field.handleBlur}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <field.FieldError />
              </field.Field>
            )}
          </form.AppField>
        </div>
        <form.AppField name="address">
          {(field) => (
            <field.TextField
              label="Address"
              placeholder="123 Main St"
              autoComplete="street-address"
            />
          )}
        </form.AppField>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>
          <form.SubmitButton>Submit</form.SubmitButton>
        </Field>
      </FieldGroup>
    </Form>
  );
};
