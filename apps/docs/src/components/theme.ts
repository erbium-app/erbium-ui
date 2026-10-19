import { useSyncExternalStore } from "react";
import { changeTheme } from "@erbium/ui/lib/change-theme";
import { flushSync } from "react-dom";

function snapshot() {
  return document.documentElement.classList.contains("dark");
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ["class"], attributes: true });

  return () => {
    observer.disconnect();
  };
}

export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

export function toggleTheme() {
  const dark = !snapshot();
  changeTheme(() => {
    flushSync(() => document.documentElement.classList.toggle("dark", dark));
  });

  try {
    localStorage.setItem("erbium-theme", dark ? "dark" : "light");
  } catch {
    /* Retain the theme for this visit. */
  }
}
