import { useState } from "react";

import { Control } from "@erbium/ui/components/control";

export function NumberExample() {
  const [value, setValue] = useState(0.7);
  return (
    <Control.Number
      label="Scale"
      value={value}
      onValueChange={setValue}
      min={0}
      max={1}
      step={0.01}
      className="w-72"
    />
  );
}
