import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function CheckboxReadOnly() {
  return (
    <Field orientation="horizontal">
      <Checkbox readOnly defaultChecked />
      <FieldLabel>Included in your plan</FieldLabel>
    </Field>
  );
}
