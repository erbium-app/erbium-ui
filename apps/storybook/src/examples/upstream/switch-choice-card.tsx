import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export function SwitchChoiceCard() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field variant="card" orientation="horizontal">
        <FieldContent>
          <FieldLabel>Share across devices</FieldLabel>
          <FieldDescription>
            Focus is shared across devices, and turns off when you leave the app.
          </FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
      <Field variant="card" orientation="horizontal">
        <FieldContent>
          <FieldLabel>Enable notifications</FieldLabel>
          <FieldDescription>
            Receive notifications when focus mode is enabled or disabled.
          </FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </Field>
    </FieldGroup>
  );
}
