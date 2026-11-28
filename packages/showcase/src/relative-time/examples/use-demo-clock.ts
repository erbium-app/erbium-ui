import { useState, useSyncExternalStore } from "react";

/*
 * Dates for these examples, measured from when they appear. In an app the dates come from your
 * data, and this is not needed.
 */

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
