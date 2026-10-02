import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export function InputRequired() {
  return (
    <Field>
      <FieldLabel>
        Required Field <span className="text-error">*</span>
      </FieldLabel>
      <Input placeholder="This field is required" required />
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  );
}
