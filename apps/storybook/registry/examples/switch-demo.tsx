// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";

export default function SwitchDemo() {
  return (
    <Field orientation="horizontal">
      <Switch />
      <FieldLabel>Airplane Mode</FieldLabel>
    </Field>
  );
}
