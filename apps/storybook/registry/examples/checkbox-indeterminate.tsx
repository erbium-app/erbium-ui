// @ts-nocheck
import { Checkbox, CheckboxGroup } from "../components/checkbox";
import { Label } from "../components/label";
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
      <div className="flex items-center gap-2">
        <Checkbox id="permissions-all" parent />
        <Label id="permissions-all-label" htmlFor="permissions-all">
          All permissions
        </Label>
      </div>
      {permissions.map((permission) => (
        <div className="flex items-center gap-2 ps-6" key={permission.id}>
          <Checkbox id={`permissions-${permission.id}`} value={permission.id} />
          <Label className="font-normal" htmlFor={`permissions-${permission.id}`}>
            {permission.label}
          </Label>
        </div>
      ))}
    </CheckboxGroup>
  );
}
