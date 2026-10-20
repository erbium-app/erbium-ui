import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";

export const CheckboxInvalid = () => (
  <FieldGroup className="mx-auto w-56">
    <Field orientation="horizontal" invalid>
      <Checkbox name="terms-checkbox-invalid" />
      <FieldLabel>Accept terms and conditions</FieldLabel>
    </Field>
  </FieldGroup>
);
