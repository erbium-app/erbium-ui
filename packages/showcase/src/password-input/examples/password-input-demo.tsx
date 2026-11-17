import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

export default function PasswordInputExample() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput placeholder="Enter your password" />
      <FieldDescription>Press the eye to show the password, and again to hide it.</FieldDescription>
    </Field>
  );
}
