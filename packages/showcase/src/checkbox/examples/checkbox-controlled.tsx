import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { useState } from "react";

const CheckboxControlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-group">
      <Field orientation="horizontal">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        <FieldLabel>Receive marketing emails</FieldLabel>
      </Field>
      <p className="text-caption text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
};

export default CheckboxControlled;
