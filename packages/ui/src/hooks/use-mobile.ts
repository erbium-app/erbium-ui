import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const mediaQuery =
  typeof window === "undefined"
    ? null
    : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function subscribe(onChange: () => void) {
  mediaQuery?.addEventListener("change", onChange);
  return () => mediaQuery?.removeEventListener("change", onChange);
}

function getSnapshot() {
  return mediaQuery?.matches ?? false;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
