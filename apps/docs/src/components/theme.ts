import { useSyncExternalStore } from "react";
import { changeTheme } from "@erbium/ui/lib/change-theme";
import { flushSync } from "react-dom";

const snapshot = () => document.documentElement.classList.contains("dark");

const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ["class"], attributes: true });

  return () => {
    observer.disconnect();
  };
};

export const useTheme = () => useSyncExternalStore(subscribe, snapshot, () => false);

export const toggleTheme = () => {
  const dark = !snapshot();
  changeTheme(() => {
    flushSync(() => document.documentElement.classList.toggle("dark", dark));
  });

  try {
    localStorage.setItem("erbium-theme", dark ? "dark" : "light");
  } catch {
    /* Retain the theme for this visit. */
  }
};
