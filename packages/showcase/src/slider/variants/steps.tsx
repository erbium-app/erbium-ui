import * as React from "react";

import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4];

export default function SliderStepsExample() {
  const [speed, setSpeed] = React.useState(1);

  return (
    <Field className="mx-auto w-full max-w-xs gap-related">
      <div className="flex items-center justify-between gap-related">
        <FieldLabel>Playback speed</FieldLabel>
        <span className="text-caption text-muted-foreground tabular-nums">{speed}×</span>
      </div>
      <Slider
        value={speed}
        onValueChange={(value) => {
          setSpeed(value);
        }}
        steps={SPEEDS}
        marks={SPEEDS.map((value) => ({ label: `${value}×`, value }))}
        format={{ maximumFractionDigits: 2 }}
      />
    </Field>
  );
}
