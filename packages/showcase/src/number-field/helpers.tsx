import { useState } from "react";

import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

export const ControlledExample = () => {
  const [value, setValue] = useState<number | null>(2500);

  return (
    <div className="flex w-56 flex-col gap-related">
      <NumberField value={value} onValueChange={setValue} min={0} largeStep={1000}>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Budget" className="text-end" />
        </NumberFieldGroup>
      </NumberField>
      <div className="flex gap-related">
        {[-1000, 1000, 10_000].map((delta) => (
          <button
            key={delta}
            type="button"
            className="rounded-md border px-2 py-1 text-metadata"
            onClick={() => {
              setValue((current) => Math.max(0, (current ?? 0) + delta));
            }}
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
      </div>
      <p className="text-metadata text-muted-foreground">Value: {value ?? "—"}</p>
    </div>
  );
};
