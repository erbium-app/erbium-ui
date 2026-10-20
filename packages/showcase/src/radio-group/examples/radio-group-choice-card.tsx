import {
  Field,
  FieldContent,
  FieldDescription,
  FieldItem,
  FieldLabel,
} from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export const RadioGroupChoiceCard = () => (
  <Field className="max-w-sm">
    <RadioGroup defaultValue="plus">
      <FieldItem variant="card" orientation="horizontal">
        <FieldContent>
          <FieldLabel>Plus</FieldLabel>
          <FieldDescription>For individuals and small teams.</FieldDescription>
        </FieldContent>
        <RadioGroupItem value="plus" />
      </FieldItem>
      <FieldItem variant="card" orientation="horizontal">
        <FieldContent>
          <FieldLabel>Pro</FieldLabel>
          <FieldDescription>For growing businesses.</FieldDescription>
        </FieldContent>
        <RadioGroupItem value="pro" />
      </FieldItem>
      <FieldItem variant="card" orientation="horizontal">
        <FieldContent>
          <FieldLabel>Enterprise</FieldLabel>
          <FieldDescription>For large teams and enterprises.</FieldDescription>
        </FieldContent>
        <RadioGroupItem value="enterprise" />
      </FieldItem>
    </RadioGroup>
  </Field>
);
