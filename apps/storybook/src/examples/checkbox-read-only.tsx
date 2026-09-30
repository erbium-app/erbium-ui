import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";

export default function CheckboxReadOnly() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="read-only-plan" readOnly defaultChecked />
      <Label htmlFor="read-only-plan">Included in your plan</Label>
    </div>
  );
}
