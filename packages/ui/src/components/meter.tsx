import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "../lib/utils";

/**
 * A scalar value within a known range, such as disk usage or a score. For work
 * that is moving toward completion use `Progress` instead.
 */
function Meter({ className, children, ...props }: MeterPrimitive.Root.Props) {
  return (
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
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn(
        "relative flex h-track w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function MeterIndicator({ className, ...props }: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("h-full bg-primary transition-all motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-control font-medium", className)}
      {...props}
    />
  );
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn("ms-auto text-caption text-muted-foreground tabular-nums", className)}
      {...props}
    />
  );
}

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue };
