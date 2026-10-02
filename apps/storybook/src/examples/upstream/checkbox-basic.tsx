import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";

export function CheckboxBasic() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox name="terms-checkbox-basic" />
        <FieldLabel>Accept terms and conditions</FieldLabel>
      </Field>
    </FieldGroup>
  );
}
