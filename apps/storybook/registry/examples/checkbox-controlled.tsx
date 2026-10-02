// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";
import { useState } from "react";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Checkbox id="controlled-marketing" checked={checked} onCheckedChange={setChecked} />
        <FieldLabel htmlFor="controlled-marketing">Receive marketing emails</FieldLabel>
      </Field>
      <p className="text-sm text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
