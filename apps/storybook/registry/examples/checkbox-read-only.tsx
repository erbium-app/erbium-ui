// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";

export default function CheckboxReadOnly() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="read-only-plan" readOnly defaultChecked />
      <FieldLabel htmlFor="read-only-plan">Included in your plan</FieldLabel>
    </Field>
  );
}
