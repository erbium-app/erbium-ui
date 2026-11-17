import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

export default function PasswordInputNewPasswordExample() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>New password</FieldLabel>
      <PasswordInput autoComplete="new-password" minLength={8} />
      <FieldDescription>Use at least 8 characters.</FieldDescription>
    </Field>
  );
}
