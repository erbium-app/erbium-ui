import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export const InputField = () => (
  <Field>
    <FieldLabel>Username</FieldLabel>
    <Input type="text" placeholder="Enter your username" />
    <FieldDescription>Choose a unique username for your account.</FieldDescription>
  </Field>
);
