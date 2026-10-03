import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function RadioGroupDemo() {
  return (
    <Field>
      <RadioGroup defaultValue="comfortable">
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="default" />
          <FieldLabel>Default</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="comfortable" />
          <FieldLabel>Comfortable</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="compact" />
          <FieldLabel>Compact</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </Field>
  );
}
