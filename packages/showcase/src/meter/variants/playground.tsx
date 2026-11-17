import { Meter, MeterIndicator, MeterTrack } from "@erbium/ui/components/meter";
import type * as React from "react";

export const defaultProps = { max: 100, min: 0, value: 24 } satisfies React.ComponentProps<
  typeof Meter
>;

export default function MeterPlaygroundExample(
  args: React.ComponentProps<typeof Meter> = defaultProps,
) {
  return (
    <Meter {...args} className="w-72" aria-label="Storage used">
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}
