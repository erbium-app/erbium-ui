import {
  detectPlatform,
  normalizeHotkey,
  useDefaultHotkeysOptions,
  useFormatForDisplay,
} from "@tanstack/react-hotkeys";
import type { DisplayHotkey } from "@tanstack/react-hotkeys";
import { useSyncExternalStore } from "react";
import { kbdClassName } from "../lib/kbd-styles";
import { skeletonBlock } from "../lib/skeleton-hints";
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

/**
 * The platform labels are formatted for: a `HotkeysProvider`'s `platform` when one is set
 * (server-rendered apps pass `detectPlatform(userAgent)` so the server HTML already matches),
 * otherwise the browser's platform after hydration.
 */
const useKbdPlatform = () => {
  const providerPlatform = useDefaultHotkeysOptions().platform;

  const detectedPlatform = useSyncExternalStore(
    subscribeToPlatform,
    detectPlatform,
    getServerPlatform,
  );

  return providerPlatform ?? detectedPlatform;
};

const Kbd = ({ className, hotkey, useSymbols = true, children, ...props }: KbdProps) => {
  const platform = useKbdPlatform();
  // Fills in the provider's platform and, in Chromium, the user's keyboard layout, so a
  // physical binding such as `[KeyW]` reads `Z` on an AZERTY keyboard.
  const formatForDisplay = useFormatForDisplay();

  const binding =
    hotkey ?? (isShortcutText(children) ? normalizeHotkey(children, platform) : undefined);

  return (
    <kbd
      data-slot="kbd"
      {...skeletonBlock}
      dir="ltr"
      className={cn(kbdClassName, className)}
      {...props}
    >
      {binding === undefined ? children : formatForDisplay(binding, { platform, useSymbols })}
    </kbd>
  );
};

export { Kbd };
