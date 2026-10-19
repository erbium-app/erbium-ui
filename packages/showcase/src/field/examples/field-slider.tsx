import { useState } from "react";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

export default function FieldSlider() {
  const [value, setValue] = useState([200, 800]);

  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldLabel>Price Range</FieldLabel>
        <FieldDescription>
          Set your budget range ($
          <span className="font-medium tabular-nums">{value[0]}</span> -{" "}
          <span className="font-medium tabular-nums">{value[1]}</span>).
        </FieldDescription>
        <Slider
          value={value}
          onValueChange={(next) => {
            setValue(Array.isArray(next) ? [...next] : [next]);
          }}
          max={1000}
          min={0}
          step={10}
          className="mt-2 w-full"
          aria-label="Price Range"
        />
      </Field>
    </div>
  );
}
