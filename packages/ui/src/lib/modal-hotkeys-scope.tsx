import { HotkeysProvider } from "@tanstack/react-hotkeys";
import * as React from "react";

interface ModalHotkeysScopeProps {
  children: React.ReactNode;
  /** The overlay's `modal` prop. A non-modal overlay leaves the page's hotkeys working. */
  modal?: boolean | "trap-focus";
}

/**
 * Gives an open modal overlay the keyboard: while it is mounted, hotkeys registered outside it
 * are suspended (and their hints hidden), so a page shortcut cannot run behind the overlay.
 * Hotkeys registered by components inside the overlay keep working.
 *
 * Render it inside the overlay's popup, which Base UI unmounts on close, so the scope is
 * active exactly while the overlay is open. Each instance gets its own scope name, so an
 * overlay opened from another overlay suspends it instead of sharing its scope.
 *
 * A non-modal overlay still gets its own scope, without `exclusive`: the page's hotkeys keep
 * working, and the overlay's hotkeys win when both register the same key.
 */
const ModalHotkeysScope = ({ children, modal = true }: ModalHotkeysScopeProps) => (
  <HotkeysProvider scope={`overlay-${React.useId()}`} exclusive={modal !== false}>
    {children}
  </HotkeysProvider>
);

export { ModalHotkeysScope };
