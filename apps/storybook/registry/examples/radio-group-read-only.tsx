// @ts-nocheck
import { Label } from "../components/label";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";

export default function RadioGroupReadOnly() {
  return (
    <RadioGroup readOnly defaultValue="pro">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="free" id="read-only-free" />
        <Label htmlFor="read-only-free">Free</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="pro" id="read-only-pro" />
        <Label htmlFor="read-only-pro">Pro (current plan)</Label>
      </div>
    </RadioGroup>
  );
}
