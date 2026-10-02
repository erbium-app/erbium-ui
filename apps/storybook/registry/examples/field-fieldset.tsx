// @ts-nocheck
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../components/field";
import { Input } from "../components/input";

export default function FieldFieldset() {
  return (
    <div className="w-full max-w-md space-y-6">
      <FieldSet>
        <FieldLegend>Address Information</FieldLegend>
        <FieldDescription>We need your address to deliver your order.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel>Street Address</FieldLabel>
            <Input type="text" placeholder="123 Main St" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input type="text" placeholder="New York" />
            </Field>
            <Field>
              <FieldLabel>Postal Code</FieldLabel>
              <Input type="text" placeholder="90502" />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
