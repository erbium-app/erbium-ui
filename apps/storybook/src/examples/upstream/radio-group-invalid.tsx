import {
  FieldDescription,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export function RadioGroupInvalid() {
  return (
    <FieldSet invalid className="w-full max-w-xs">
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
      <RadioGroup defaultValue="email">
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="email" />
          <FieldLabel className="font-normal">Email only</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="sms" />
          <FieldLabel className="font-normal">SMS only</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <RadioGroupItem value="both" />
          <FieldLabel className="font-normal">Both Email & SMS</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </FieldSet>
  );
}
