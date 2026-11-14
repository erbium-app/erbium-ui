import { Form, useAppForm } from "@erbium/ui/components/form";
import { useId } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@erbium/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";

const months = [
  { label: "MM", value: null },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

const years = [
  { label: "YYYY", value: null },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
];

const FieldDemo = () => {
  const id = useId();

  const form = useAppForm({
    defaultValues: {
      cardholder: "",
      number: "",
      month: "",
      year: "",
      cvv: "",
      sameAddress: true,
      comments: "",
    },
  });

  return (
    <div className="w-full max-w-md">
      <Form form={form}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>All transactions are secure and encrypted</FieldDescription>
            <FieldGroup>
              <form.AppField
                name="cardholder"
                validators={{
                  onDynamic: ({ value }) =>
                    value.trim() ? undefined : "Enter the name on the card.",
                }}
              >
                {(field) => (
                  <field.TextField
                    label="Name on Card"
                    autoComplete="cc-name"
                    placeholder="Alex Smith"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField
                name="number"
                validators={{
                  onDynamic: ({ value }) =>
                    /^\d{16}$/u.test(value.replaceAll(" ", ""))
                      ? undefined
                      : "Enter a 16-digit sample card number.",
                }}
              >
                {(field) => (
                  <field.TextField
                    label="Card Number"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    description="Use a sample 16-digit number."
                    required
                  />
                )}
              </form.AppField>
              <div className="grid grid-cols-3 gap-group">
                <form.AppField
                  name="month"
                  validators={{
                    onDynamic: ({ value }) => (value ? undefined : "Choose an expiry month."),
                  }}
                >
                  {(field) => (
                    <field.Field>
                      <FieldLabel htmlFor={`${id}-month`}>Month</FieldLabel>
                      <Select
                        items={months}
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value ?? "");
                        }}
                      >
                        <SelectTrigger id={`${id}-month`} onBlur={field.handleBlur}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {months.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <field.FieldError />
                    </field.Field>
                  )}
                </form.AppField>
                <form.AppField
                  name="year"
                  validators={{
                    onDynamic: ({ value }) => (value ? undefined : "Choose an expiry year."),
                  }}
                >
                  {(field) => (
                    <field.Field>
                      <FieldLabel htmlFor={`${id}-year`}>Year</FieldLabel>
                      <Select
                        items={years}
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value ?? "");
                        }}
                      >
                        <SelectTrigger id={`${id}-year`} onBlur={field.handleBlur}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {years.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <field.FieldError />
                    </field.Field>
                  )}
                </form.AppField>
                <form.AppField
                  name="cvv"
                  validators={{
                    onDynamic: ({ value }) =>
                      /^\d{3,4}$/u.test(value) ? undefined : "Enter 3 or 4 digits.",
                  }}
                >
                  {(field) => (
                    <field.TextField
                      label="CVV"
                      autoComplete="off"
                      inputMode="numeric"
                      placeholder="123"
                      required
                    />
                  )}
                </form.AppField>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldDescription>
              The billing address associated with your payment method
            </FieldDescription>
            <FieldGroup>
              <form.AppField name="sameAddress">
                {(field) => <field.CheckboxField label="Same as shipping address" />}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="comments">
                {(field) => (
                  <field.TextareaField label="Comments" placeholder="Add any additional comments" />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <form.SubmitButton>Submit</form.SubmitButton>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  );
};

export default FieldDemo;
