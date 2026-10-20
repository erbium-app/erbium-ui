import {
  Field,
  FieldContent,
  FieldDescription,
  FieldItem,
  FieldLabel,
} from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export const RadioGroupDescription = () => (
  <Field>
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <FieldItem orientation="horizontal">
        <RadioGroupItem value="default" />
        <FieldContent>
          <FieldLabel>Default</FieldLabel>
          <FieldDescription>Standard spacing for most use cases.</FieldDescription>
        </FieldContent>
      </FieldItem>
      <FieldItem orientation="horizontal">
        <RadioGroupItem value="comfortable" />
        <FieldContent>
          <FieldLabel>Comfortable</FieldLabel>
          <FieldDescription>More space between elements.</FieldDescription>
        </FieldContent>
      </FieldItem>
      <FieldItem orientation="horizontal">
        <RadioGroupItem value="compact" />
        <FieldContent>
          <FieldLabel>Compact</FieldLabel>
          <FieldDescription>Minimal spacing for dense layouts.</FieldDescription>
        </FieldContent>
      </FieldItem>
    </RadioGroup>
  </Field>
);
