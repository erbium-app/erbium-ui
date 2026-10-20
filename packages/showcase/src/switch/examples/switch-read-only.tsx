import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

const SwitchReadOnly = () => (
  <Field orientation="horizontal">
    <Switch readOnly defaultChecked />
    <FieldLabel>Managed by your organization</FieldLabel>
  </Field>
);

export default SwitchReadOnly;
