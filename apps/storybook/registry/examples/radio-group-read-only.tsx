// @ts-nocheck
import { Field, FieldItem, FieldLabel } from "../components/field";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";

export default function RadioGroupReadOnly() {
  return (
    <Field>
      <RadioGroup readOnly defaultValue="pro">
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="free" />
          <FieldLabel>Free</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="pro" />
          <FieldLabel>Pro (current plan)</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </Field>
  );
}
