import * as React from "react";

import { Progress } from "@erbium/ui/components/progress";
import { Slider } from "@erbium/ui/components/slider";

export const ProgressControlled = () => {
  const [value, setValue] = React.useState(50);

  return (
    <div className="flex w-full max-w-sm flex-col gap-group">
      <Progress value={value} className="w-full" />
      <Slider
        value={value}
        onValueChange={(next) => {
          setValue(next);
        }}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
};
