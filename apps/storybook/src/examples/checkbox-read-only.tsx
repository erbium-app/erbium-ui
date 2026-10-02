import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function CheckboxReadOnly() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="read-only-plan" readOnly defaultChecked />
      <FieldLabel htmlFor="read-only-plan">Included in your plan</FieldLabel>
    </Field>
  );
}
