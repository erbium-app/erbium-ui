import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

const PasswordInputInvalid = () => (
  <Field invalid className="max-w-sm">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput defaultValue="short" />
    <FieldError match>Use at least 8 characters.</FieldError>
  </Field>
);

export default PasswordInputInvalid;
