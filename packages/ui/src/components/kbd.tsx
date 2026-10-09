import { detectPlatform, formatForDisplay, type DisplayHotkey } from "@tanstack/hotkeys";
import { useSyncExternalStore } from "react";
import { cn } from "../lib/utils";

type KbdProps = React.ComponentProps<"kbd"> & {
  hotkey?: DisplayHotkey;
  useSymbols?: boolean;
};

const subscribeToPlatform = () => () => {};
const getServerPlatform = () => "linux" as const;

function Kbd({ className, hotkey, useSymbols = true, children, ...props }: KbdProps) {
  const platform = useSyncExternalStore(subscribeToPlatform, detectPlatform, getServerPlatform);
  const binding = hotkey ?? (typeof children === "string" ? children : undefined);

  return (
    <kbd
      data-slot="kbd"
      dir="ltr"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm border surface-control px-1 font-sans text-control-sm font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:shadow-none in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    >
      {binding === undefined ? children : formatForDisplay(binding, { platform, useSymbols })}
    </kbd>
  );
}

export { Kbd };
