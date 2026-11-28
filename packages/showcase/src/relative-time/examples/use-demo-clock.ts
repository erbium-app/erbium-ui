import { useState, useSyncExternalStore } from "react";

/* Example dates count from when they appear. An app takes its dates from its data. */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A fixed moment for server rendering, so the server and the browser write the same HTML. */
const reference = Date.UTC(2026, 0, 15, 12);

const subscribe = () => () => {
  // Whether the page has hydrated never changes back.
};

const useDemoClock = () => {
  // oxlint-disable-next-line react/hook-use-state -- the time is read once, when the example appears, and never replaced.
  const [appeared] = useState(() => Date.now());

  return useSyncExternalStore(
    subscribe,
    () => appeared,
    () => reference,
  );
};

export { DAY, HOUR, MINUTE, useDemoClock };
