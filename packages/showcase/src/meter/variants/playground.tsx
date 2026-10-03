import { Meter, MeterIndicator, MeterTrack } from "@erbium/ui/components/meter";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Meter>) => (
  <Meter {...args} className="w-72" aria-label="Storage used">
    <MeterTrack>
      <MeterIndicator />
    </MeterTrack>
  </Meter>
);

export default Example;
