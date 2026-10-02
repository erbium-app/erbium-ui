// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";

export default function SwitchReadOnly() {
  return (
    <Field orientation="horizontal">
      <Switch id="read-only-sync" readOnly defaultChecked />
      <FieldLabel htmlFor="read-only-sync">Managed by your organization</FieldLabel>
    </Field>
  );
}
