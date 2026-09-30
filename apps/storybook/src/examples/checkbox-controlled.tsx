import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";
import { useState } from "react";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="controlled-marketing" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="controlled-marketing">Receive marketing emails</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
