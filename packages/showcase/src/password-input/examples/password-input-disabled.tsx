import { Field, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

const PasswordInputDisabled = () => (
  <Field disabled className="max-w-sm">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput defaultValue="correct-horse" />
  </Field>
);

export default PasswordInputDisabled;
