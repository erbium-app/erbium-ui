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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";

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
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value ?? "");
                        }}
                      >
                        <SelectTrigger id={`${id}-month`} onBlur={field.handleBlur}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01</SelectItem>
                          <SelectItem value="02">02</SelectItem>
                          <SelectItem value="03">03</SelectItem>
                          <SelectItem value="04">04</SelectItem>
                          <SelectItem value="05">05</SelectItem>
                          <SelectItem value="06">06</SelectItem>
                          <SelectItem value="07">07</SelectItem>
                          <SelectItem value="08">08</SelectItem>
                          <SelectItem value="09">09</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="11">11</SelectItem>
                          <SelectItem value="12">12</SelectItem>
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
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value ?? "");
                        }}
                      >
                        <SelectTrigger id={`${id}-year`} onBlur={field.handleBlur}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                          <SelectItem value="2028">2028</SelectItem>
                          <SelectItem value="2029">2029</SelectItem>
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
