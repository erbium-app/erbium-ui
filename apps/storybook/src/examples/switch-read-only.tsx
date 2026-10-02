import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchReadOnly() {
  return (
    <Field orientation="horizontal">
      <Switch id="read-only-sync" readOnly defaultChecked />
      <FieldLabel htmlFor="read-only-sync">Managed by your organization</FieldLabel>
    </Field>
  );
}
