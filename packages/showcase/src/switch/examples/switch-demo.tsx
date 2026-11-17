import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchExample() {
  return (
    <Field orientation="horizontal">
      <Switch />
      <FieldLabel>Airplane Mode</FieldLabel>
    </Field>
  );
}
