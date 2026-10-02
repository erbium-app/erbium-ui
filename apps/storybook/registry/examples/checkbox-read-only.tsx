// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";

export default function CheckboxReadOnly() {
  return (
    <Field orientation="horizontal">
      <Checkbox readOnly defaultChecked />
      <FieldLabel>Included in your plan</FieldLabel>
    </Field>
  );
}
