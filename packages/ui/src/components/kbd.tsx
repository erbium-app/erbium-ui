import { detectPlatform, formatForDisplay } from "@tanstack/hotkeys";
import type { DisplayHotkey } from "@tanstack/hotkeys";
import { useSyncExternalStore } from "react";
import { kbdClassName } from "../lib/kbd-styles";
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
    <kbd data-slot="kbd" dir="ltr" className={cn(kbdClassName, className)} {...props}>
      {binding === undefined ? children : formatForDisplay(binding, { platform, useSymbols })}
    </kbd>
  );
}

export { Kbd };
