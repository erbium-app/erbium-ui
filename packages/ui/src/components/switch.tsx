import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type * as React from "react";
import { cn } from "../lib/utils";

const switchIconClassName =
  "pointer-events-none absolute inset-y-0 grid w-[calc(100%-var(--switch-thumb))] place-content-center transition-[scale,opacity] duration-200 ease-out motion-reduce:transition-none [&_svg]:size-2.25 group-data-[size=sm]/switch:[&_svg]:size-1.75";

function Switch({
  className,
  size = "default",
  startIcon,
  endIcon,
  thumbIcon,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
  /** Shown on the track's start side while the switch is on. */
  startIcon?: React.ReactNode;
  /** Shown on the track's end side while the switch is off. */
  endIcon?: React.ReactNode;
  /** Shown on the thumb in both states. */
  thumbIcon?: React.ReactNode;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch @container relative inline-flex shrink-0 items-center rounded-full border px-px border-transparent transition-all outline-none group-has-focus-visible/field-label:border-transparent group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:active:[--switch-thumb-stretch:1.2] aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=default]:[--switch-thumb:--spacing(3.5)] data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[size=sm]:[--switch-thumb:--spacing(2.5)] motion-reduce:transition-none dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {startIcon ? (
        <span
          aria-hidden
          data-slot="switch-start-icon"
          className={cn(
            switchIconClassName,
            "start-0 scale-0 text-primary-foreground opacity-0 group-data-checked/switch:scale-100 group-data-checked/switch:opacity-100",
          )}
        >
          {startIcon}
        </span>
      ) : null}
      {endIcon ? (
        <span
          aria-hidden
          data-slot="switch-end-icon"
          className={cn(
            switchIconClassName,
            "end-0 scale-0 text-muted-foreground opacity-0 group-data-unchecked/switch:scale-100 group-data-unchecked/switch:opacity-100",
          )}
        >
          {endIcon}
        </span>
      ) : null}
      {/* The thumb springs across the track and stretches toward the
          center while pressed; 100cqw is the track's inner width. */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none relative z-10 block h-(--switch-thumb) w-[calc(var(--switch-thumb)*var(--switch-thumb-stretch,1))] rounded-full bg-background ring-0 transition-[translate,width,background-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none data-checked:translate-x-[calc(100cqw-100%)] rtl:data-checked:-translate-x-[calc(100cqw-100%)] dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
      >
        {thumbIcon ? (
          <span
            aria-hidden
            data-slot="switch-thumb-icon"
            className="absolute inset-0 grid place-content-center text-muted-foreground [&_svg]:size-2.25 group-data-[size=sm]/switch:[&_svg]:size-1.75"
          >
            {thumbIcon}
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
