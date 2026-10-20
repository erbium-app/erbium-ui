import { Button } from "@erbium/ui/components/button";
import { Checkbox } from "@erbium/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Textarea } from "@erbium/ui/components/textarea";
import { StatefulButton } from "@erbium/ui/components/stateful-button";

const FieldDemo = () => (
  <div className="w-full max-w-md">
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Payment Method</FieldLegend>
          <FieldDescription>All transactions are secure and encrypted</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel>Name on Card</FieldLabel>
              <Input placeholder="Alex Smith" required />
            </Field>
            <Field>
              <FieldLabel>Card Number</FieldLabel>
              <Input placeholder="1234 5678 9012 3456" required />
              <FieldDescription>Enter your 16-digit card number</FieldDescription>
            </Field>
            <div className="grid grid-cols-3 gap-group">
              <Field>
                <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>
                <Select defaultValue="">
                  <SelectTrigger id="checkout-exp-month-ts6">
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
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>
                <Select defaultValue="">
                  <SelectTrigger id="checkout-7j9-exp-year-f59">
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
              </Field>
              <Field>
                <FieldLabel>CVV</FieldLabel>
                <Input placeholder="123" required />
              </Field>
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
            <Field orientation="horizontal">
              <Checkbox defaultChecked />
              <FieldLabel className="font-normal">Same as shipping address</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Comments</FieldLabel>
              <Textarea placeholder="Add any additional comments" className="resize-none" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <StatefulButton type="submit">Submit</StatefulButton>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
);

export default FieldDemo;
