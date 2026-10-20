import * as React from "react";

import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

export const SliderControlled = () => {
  const [value, setValue] = React.useState([0.3, 0.7]);

  return (
    <Field className="mx-auto max-w-xs gap-related">
      <div className="flex items-center justify-between gap-related">
        <FieldLabel>Temperature</FieldLabel>
        <span className="text-caption text-muted-foreground">{value.join(", ")}</span>
      </div>
      <Slider
        value={value}
        onValueChange={(value) => {
          setValue(value as number[]);
        }}
        min={0}
        max={1}
        step={0.1}
      />
    </Field>
  );
};
