import {
  detectPlatform,
  isHotkeySequence,
  parseHotkey,
  useDefaultHotkeysOptions,
} from "@tanstack/react-hotkeys";
import type { HotkeyPlatform, RegisterableHotkey } from "@tanstack/react-hotkeys";
import { useSyncExternalStore } from "react";

const subscribeToPlatform = () => () => {
  // The platform does not change during a session, so there is nothing to unsubscribe.
};

const getServerPlatform = (): HotkeyPlatform => "linux";

/**
 * The platform hotkeys resolve `Mod` for: a `HotkeysProvider`'s `platform` when one is set
 * (server-rendered apps pass `detectPlatform(userAgent)` so the server HTML already matches),
 * otherwise the browser's platform after hydration.
 */
const useHotkeyPlatform = (): HotkeyPlatform => {
  const providerPlatform = useDefaultHotkeysOptions().platform;

  const detectedPlatform = useSyncExternalStore(
    subscribeToPlatform,
    detectPlatform,
    getServerPlatform,
  );

  return providerPlatform ?? detectedPlatform;
};

/**
 * The `aria-keyshortcuts` value for a chord, such as `Meta+Shift+K` on macOS. Sequences and
 * physical-key bindings have no `aria-keyshortcuts` form, so they return `undefined`.
 */
const toAriaKeyShortcuts = (
  hotkey: RegisterableHotkey | undefined,
  platform: HotkeyPlatform,
): string | undefined => {
  if (hotkey === undefined || isHotkeySequence(hotkey)) {
    return undefined;
  }

  const { key, modifiers } = parseHotkey(hotkey, platform);

  if (key === undefined) {
    return undefined;
  }

  let ariaKey = key;

  if (key === " ") {
    ariaKey = "Space";
  } else if (key === "+") {
    ariaKey = "Plus";
  }

  return [...modifiers, ariaKey].join("+");
};

export { toAriaKeyShortcuts, useHotkeyPlatform };
