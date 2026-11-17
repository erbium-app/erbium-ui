import { Field, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

export default function PasswordInputDisabledExample() {
  return (
    <Field disabled className="max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput defaultValue="correct-horse" />
    </Field>
  );
}
