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

/* `aria-keyshortcuts` spells modifiers with these names, in this order, before the key. */
const ariaModifiers = [
  ["ctrl", "Control"],
  ["alt", "Alt"],
  ["shift", "Shift"],
  ["meta", "Meta"],
] as const;

/* Keys whose `KeyboardEvent.key` value cannot appear in the attribute as written. */
const ariaKeyName = (key: string) => {
  if (key === " ") {
    return "Space";
  }

  return key === "+" ? "Plus" : key;
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

  const chord = parseHotkey(hotkey, platform);

  if (chord.key === undefined) {
    return undefined;
  }

  const parts = ariaModifiers.flatMap(([flag, name]) => (chord[flag] ? [name] : []));

  return [...parts, ariaKeyName(chord.key)].join("+");
};

export { toAriaKeyShortcuts, useHotkeyPlatform };
