import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import { PasswordInput } from "@erbium/ui/components/password-input";

export default function FieldInputExample() {
  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input type="text" placeholder="Jane Doe" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <PasswordInput autoComplete="new-password" placeholder="••••••••" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
