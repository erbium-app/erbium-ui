import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { useState } from "react";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        <FieldLabel>Receive marketing emails</FieldLabel>
      </Field>
      <p className="text-caption text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
