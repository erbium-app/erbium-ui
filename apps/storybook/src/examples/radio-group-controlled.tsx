import { Label } from "@erbium/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import { useState } from "react";

const options = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function RadioGroupControlled() {
  const [value, setValue] = useState("system");

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup value={value} onValueChange={setValue}>
        {options.map((option) => (
          <div className="flex items-center gap-3" key={option.value}>
            <RadioGroupItem value={option.value} id={`controlled-${option.value}`} />
            <Label htmlFor={`controlled-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        value: <code>{value}</code>
      </p>
    </div>
  );
}
