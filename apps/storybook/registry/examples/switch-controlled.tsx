// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";
import { useState } from "react";

export default function SwitchControlled() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <FieldLabel>Wi-Fi</FieldLabel>
      </Field>
      <p className="text-sm text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
