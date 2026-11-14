import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";

const MeterTrack = ({ className, ...props }: MeterPrimitive.Track.Props) => (
  <MeterPrimitive.Track
    data-slot="meter-track"
    {...skeletonBlock}
    className={cn(
      "relative flex h-track w-full items-center overflow-x-hidden rounded-full bg-muted",
      className,
    )}
    {...props}
  />
);

const MeterIndicator = ({ className, ...props }: MeterPrimitive.Indicator.Props) => (
  <MeterPrimitive.Indicator
    data-slot="meter-indicator"
    className={cn("h-full bg-primary transition-all motion-reduce:transition-none", className)}
    {...props}
  />
);

/**
 * A scalar value within a known range, such as disk usage or a score. For work
 * that is moving toward completion use `Progress` instead.
 */
const Meter = ({ className, children, ...props }: MeterPrimitive.Root.Props) => (
  <MeterPrimitive.Root
    data-slot="meter"
    className={cn("flex w-full flex-wrap gap-3", className)}
    {...props}
  >
    {children ?? (
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    )}
  </MeterPrimitive.Root>
);

const MeterLabel = ({ className, ...props }: MeterPrimitive.Label.Props) => (
  <MeterPrimitive.Label
    data-slot="meter-label"
    className={cn("text-control", className)}
    {...props}
  />
);

const MeterValue = ({ className, ...props }: MeterPrimitive.Value.Props) => (
  <MeterPrimitive.Value
    data-slot="meter-value"
    className={cn("ms-auto text-caption text-muted-foreground tabular-nums", className)}
    {...props}
  />
);

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue };
