import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchReadOnly() {
  return (
    <Field orientation="horizontal">
      <Switch readOnly defaultChecked />
      <FieldLabel>Managed by your organization</FieldLabel>
    </Field>
  );
}
