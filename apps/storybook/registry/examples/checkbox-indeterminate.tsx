// @ts-nocheck
import { Checkbox, CheckboxGroup } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";
import { useState } from "react";

const permissions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export default function CheckboxIndeterminate() {
  const [selected, setSelected] = useState<string[]>(["read"]);

  return (
    <CheckboxGroup
      aria-labelledby="permissions-all-label"
      allValues={permissions.map((permission) => permission.id)}
      value={selected}
      onValueChange={setSelected}
    >
      <Field orientation="horizontal">
        <Checkbox id="permissions-all" parent />
        <FieldLabel id="permissions-all-label" htmlFor="permissions-all">
          All permissions
        </FieldLabel>
      </Field>
      {permissions.map((permission) => (
        <Field orientation="horizontal" className="ps-6" key={permission.id}>
          <Checkbox id={`permissions-${permission.id}`} value={permission.id} />
          <FieldLabel className="font-normal" htmlFor={`permissions-${permission.id}`}>
            {permission.label}
          </FieldLabel>
        </Field>
      ))}
    </CheckboxGroup>
  );
}
