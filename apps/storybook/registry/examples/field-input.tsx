// @ts-nocheck
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "../components/field";
import { Input } from "../components/input";

export default function FieldInput() {
  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input type="text" placeholder="Max Leiter" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <Input type="password" placeholder="••••••••" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
