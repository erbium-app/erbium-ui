import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";

const ProgressTrack = ({ className, ...props }: ProgressPrimitive.Track.Props) => (
  <ProgressPrimitive.Track
    className={cn(
      "relative flex h-track w-full items-center overflow-x-hidden rounded-full bg-muted",
      className,
    )}
    data-slot="progress-track"
    {...skeletonBlock}
    {...props}
  />
);

const ProgressIndicator = ({ className, ...props }: ProgressPrimitive.Indicator.Props) => (
  <ProgressPrimitive.Indicator
    data-slot="progress-indicator"
    className={cn(
      "h-full bg-primary transition-all data-indeterminate:w-1/3 data-indeterminate:animate-pulse motion-reduce:transition-none motion-reduce:data-indeterminate:animate-none",
      className,
    )}
    {...props}
  />
);

const Progress = ({ className, children, value, ...props }: ProgressPrimitive.Root.Props) => (
  <ProgressPrimitive.Root
    value={value}
    data-slot="progress"
    className={cn("flex flex-wrap gap-3", className)}
    {...props}
  >
    {children}
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
  </ProgressPrimitive.Root>
);

const ProgressLabel = ({ className, ...props }: ProgressPrimitive.Label.Props) => (
  <ProgressPrimitive.Label
    className={cn("text-control", className)}
    data-slot="progress-label"
    {...props}
  />
);

const ProgressValue = ({ className, ...props }: ProgressPrimitive.Value.Props) => (
  <ProgressPrimitive.Value
    className={cn("ms-auto text-caption text-muted-foreground tabular-nums", className)}
    data-slot="progress-value"
    {...props}
  />
);

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
