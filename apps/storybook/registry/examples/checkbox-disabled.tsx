// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Label } from "../components/label";

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Enable notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-indeterminate" disabled indeterminate />
        <Label htmlFor="disabled-indeterminate">Sync some folders</Label>
      </div>
    </div>
  );
}
