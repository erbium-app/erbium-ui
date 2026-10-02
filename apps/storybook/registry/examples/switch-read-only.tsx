// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";

export default function SwitchReadOnly() {
  return (
    <Field orientation="horizontal">
      <Switch readOnly defaultChecked />
      <FieldLabel>Managed by your organization</FieldLabel>
    </Field>
  );
}
