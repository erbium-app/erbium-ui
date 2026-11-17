import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import { useState } from "react";

const options = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function RadioGroupControlledExample() {
  const [value, setValue] = useState("light");

  return (
    <div className="flex flex-col gap-group">
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
      <p className="text-caption text-muted-foreground">
        value: <code>{value}</code>
      </p>
    </div>
  );
}
