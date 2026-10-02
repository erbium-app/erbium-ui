// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
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
          <Field orientation="horizontal" key={option.value}>
            <RadioGroupItem value={option.value} id={`controlled-${option.value}`} />
            <FieldLabel htmlFor={`controlled-${option.value}`}>{option.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        value: <code>{value}</code>
      </p>
    </div>
  );
}
