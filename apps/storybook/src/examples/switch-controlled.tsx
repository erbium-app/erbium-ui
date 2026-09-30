import { Label } from "@erbium/ui/components/label";
import { Switch } from "@erbium/ui/components/switch";
import { useState } from "react";

export default function SwitchControlled() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="controlled-wifi" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="controlled-wifi">Wi-Fi</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        checked: <code>{String(checked)}</code>
      </p>
    </div>
  );
}
