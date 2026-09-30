// @ts-nocheck
import { Label } from "../components/label";
import { Switch } from "../components/switch";

export default function SwitchReadOnly() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="read-only-sync" readOnly defaultChecked />
      <Label htmlFor="read-only-sync">Managed by your organization</Label>
    </div>
  );
}
