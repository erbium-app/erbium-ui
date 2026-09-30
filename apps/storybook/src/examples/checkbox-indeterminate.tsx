import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";
import { useState } from "react";

const permissions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export default function CheckboxIndeterminate() {
  const [selected, setSelected] = useState<string[]>(["read"]);

  const allSelected = selected.length === permissions.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="permissions-all"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) =>
            setSelected(checked ? permissions.map((permission) => permission.id) : [])
          }
        />
        <Label htmlFor="permissions-all">All permissions</Label>
      </div>
      <div className="flex flex-col gap-3 ps-6">
        {permissions.map((permission) => (
          <div className="flex items-center gap-2" key={permission.id}>
            <Checkbox
              id={`permissions-${permission.id}`}
              checked={selected.includes(permission.id)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...current, permission.id]
                    : current.filter((id) => id !== permission.id),
                )
              }
            />
            <Label className="font-normal" htmlFor={`permissions-${permission.id}`}>
              {permission.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
