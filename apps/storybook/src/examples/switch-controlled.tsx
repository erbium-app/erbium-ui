import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
import { useState } from "react";

export default function SwitchControlled() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Switch id="controlled-wifi" checked={checked} onCheckedChange={setChecked} />
        <FieldLabel htmlFor="controlled-wifi">Wi-Fi</FieldLabel>
      </Field>
      <p className="text-sm text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
