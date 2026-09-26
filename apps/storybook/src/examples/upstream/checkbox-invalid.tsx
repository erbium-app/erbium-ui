import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-checkbox-invalid" name="terms-checkbox-invalid" aria-invalid />
        <FieldLabel htmlFor="terms-checkbox-invalid">Accept terms and conditions</FieldLabel>
      </Field>
    </FieldGroup>
  );
}
