// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";

export default function SwitchDemo() {
  return (
    <Field orientation="horizontal">
      <Switch id="airplane-mode" />
      <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
    </Field>
  );
}
