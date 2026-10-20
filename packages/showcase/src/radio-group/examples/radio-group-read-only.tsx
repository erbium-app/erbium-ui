import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

const RadioGroupReadOnly = () => (
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

export default RadioGroupReadOnly;
