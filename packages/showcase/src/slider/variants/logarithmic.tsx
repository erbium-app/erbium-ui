import * as React from "react";

import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

const hertz = (value: number) => (value >= 1000 ? `${value / 1000} kHz` : `${value} Hz`);

const MARKS = [20, 100, 1000, 10_000, 20_000].map((value) => ({
  label: hertz(value).replace(" ", ""),
  value,
}));

const Example = () => {
  const [cutoff, setCutoff] = React.useState(1000);
  const [committed, setCommitted] = React.useState(1000);

  return (
    <Field className="mx-auto w-full max-w-sm gap-related">
      <div className="flex items-center justify-between gap-related">
        <FieldLabel>Cutoff</FieldLabel>
        <span className="text-caption text-muted-foreground tabular-nums">
          {hertz(cutoff)} · applied {hertz(committed)}
        </span>
      </div>
      <Slider
        value={cutoff}
        onValueChange={(value) => {
          setCutoff(value);
        }}
        onValueCommitted={(value) => {
          setCommitted(value);
        }}
        scale="log"
        min={20}
        max={20_000}
        step={1}
        marks={MARKS}
        format={{ maximumFractionDigits: 0 }}
      />
    </Field>
  );
};

export default Example;
