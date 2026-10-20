import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

const SwitchDemo = () => (
  <Field orientation="horizontal">
    <Switch />
    <FieldLabel>Airplane Mode</FieldLabel>
  </Field>
);

export default SwitchDemo;
