import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
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
      <Field>
        <RadioGroup value={value} onValueChange={setValue}>
          {options.map((option) => (
            <FieldItem orientation="horizontal" key={option.value}>
              <RadioGroupItem value={option.value} />
              <FieldLabel>{option.label}</FieldLabel>
            </FieldItem>
          ))}
        </RadioGroup>
      </Field>
      <p className="text-sm text-muted-foreground">
        value: <code>{value}</code>
      </p>
    </div>
  );
}
