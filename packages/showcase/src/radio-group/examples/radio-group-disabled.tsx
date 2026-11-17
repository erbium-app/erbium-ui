import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function RadioGroupDisabledExample() {
  return (
    <Field>
      <RadioGroup defaultValue="option2" className="w-fit">
        <FieldItem orientation="horizontal" disabled>
          <RadioGroupItem value="option1" />
          <FieldLabel className="font-normal">Disabled</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="option2" />
          <FieldLabel className="font-normal">Option 2</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="option3" />
          <FieldLabel className="font-normal">Option 3</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </Field>
  );
}
