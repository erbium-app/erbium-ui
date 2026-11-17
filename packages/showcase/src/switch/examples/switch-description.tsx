import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchDescriptionExample() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel>Share across devices</FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
      <Switch />
    </Field>
  );
}
