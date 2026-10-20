import { Checkbox } from "@erbium/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@erbium/ui/components/field";

export const CheckboxDescription = () => (
  <FieldGroup className="mx-auto w-72">
    <Field orientation="horizontal">
      <Checkbox name="terms-checkbox-desc" defaultChecked />
      <FieldContent>
        <FieldLabel>Accept terms and conditions</FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
      </FieldContent>
    </Field>
  </FieldGroup>
);
