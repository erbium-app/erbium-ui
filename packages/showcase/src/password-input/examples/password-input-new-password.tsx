import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

const PasswordInputNewPassword = () => (
  <Field className="max-w-sm">
    <FieldLabel>New password</FieldLabel>
    <PasswordInput autoComplete="new-password" minLength={8} />
    <FieldDescription>Use at least 8 characters.</FieldDescription>
  </Field>
);

export default PasswordInputNewPassword;
