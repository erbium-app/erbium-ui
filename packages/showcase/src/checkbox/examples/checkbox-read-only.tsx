import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const CheckboxReadOnly = () => (
  <Field orientation="horizontal">
    <Checkbox readOnly defaultChecked />
    <FieldLabel>Included in your plan</FieldLabel>
  </Field>
);

export default CheckboxReadOnly;
