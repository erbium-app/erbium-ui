import { detectPlatform, formatForDisplay, normalizeHotkey } from "@tanstack/hotkeys";
import type { DisplayHotkey } from "@tanstack/hotkeys";
import { useSyncExternalStore } from "react";
import { kbdClassName } from "../lib/kbd-styles";
import { cn } from "../lib/utils";

type KbdProps = React.ComponentProps<"kbd"> & {
  hotkey?: DisplayHotkey;
  useSymbols?: boolean;
};

const subscribeToPlatform = () => () => {
  // The platform does not change during a session, so there is nothing to unsubscribe.
};

const getServerPlatform = () => "linux" as const;
const isShortcutText = (value: React.ReactNode): value is string => typeof value === "string";

const Kbd = ({ className, hotkey, useSymbols = true, children, ...props }: KbdProps) => {
  const platform = useSyncExternalStore(subscribeToPlatform, detectPlatform, getServerPlatform);

  const binding =
    hotkey ?? (isShortcutText(children) ? normalizeHotkey(children, platform) : undefined);

  return (
    <kbd data-slot="kbd" dir="ltr" className={cn(kbdClassName, className)} {...props}>
      {binding === undefined ? children : formatForDisplay(binding, { platform, useSymbols })}
    </kbd>
  );
};

export { Kbd };
