import { Field, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function RadioGroupReadOnly() {
  return (
    <RadioGroup readOnly defaultValue="pro">
      <Field orientation="horizontal">
        <RadioGroupItem value="free" id="read-only-free" />
        <FieldLabel htmlFor="read-only-free">Free</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="pro" id="read-only-pro" />
        <FieldLabel htmlFor="read-only-pro">Pro (current plan)</FieldLabel>
      </Field>
    </RadioGroup>
  );
}
