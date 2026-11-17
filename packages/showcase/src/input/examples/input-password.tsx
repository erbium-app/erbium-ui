import { Field, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

export default function InputPasswordExample() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput />
    </Field>
  );
}
