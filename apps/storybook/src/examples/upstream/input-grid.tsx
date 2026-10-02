import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export function InputGrid() {
  return (
    <FieldGroup className="grid max-w-sm grid-cols-2">
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <Input placeholder="Jordan" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <Input placeholder="Lee" />
      </Field>
    </FieldGroup>
  );
}
