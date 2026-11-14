import { Field, FieldControl, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export const InputRequired = () => (
  <Field required>
    <FieldLabel>Required field</FieldLabel>
    <FieldControl render={<Input placeholder="This field is required" />} />
    <FieldDescription>This field must be filled out.</FieldDescription>
  </Field>
);
