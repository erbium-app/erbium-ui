import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function RadioGroupReadOnlyExample() {
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
