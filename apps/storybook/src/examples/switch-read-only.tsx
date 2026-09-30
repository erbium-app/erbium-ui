import { Label } from "@erbium/ui/components/label";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchReadOnly() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="read-only-sync" readOnly defaultChecked />
      <Label htmlFor="read-only-sync">Managed by your organization</Label>
    </div>
  );
}
