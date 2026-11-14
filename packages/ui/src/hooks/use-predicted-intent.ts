import { ForesightManager, useForesight } from "@foresightjs/react";
import type { HitSlop } from "@foresightjs/react";

// Foresight mirrors its state onto `data-active`, `data-predicted`, and `data-status` by
// default. Base UI parts style themselves through `data-active` and `data-status`, so the
// attributes stay off for every element the library registers. The manager is a client
// singleton; registration happens in effects, so the server never creates it.
if (typeof window !== "undefined") {
  ForesightManager.instance.alterGlobalSettings({ setDataAttributes: false });
}

interface PredictedIntentOptions {
  /**
   * Whether the element takes part in prediction. A disabled element stays registered and
   * never fires.
   * @default true
   */
  enabled?: boolean;
  /**
   * Extra distance around the element that counts as a hit, in pixels or per side.
   * @default 0
   */
  hitSlop?: HitSlop;
  /** A label for Foresight's development tools. */
  name?: string;
  /**
   * Milliseconds before a fired element can fire again. Match it to how long the work it
   * starts stays fresh.
   * @default Infinity
   */
  reactivateAfter?: number;
}

/**
 * Calls `onIntent` when the user is about to interact with an element: the cursor is heading
 * for it, it is a tab stop or two away, scrolling is bringing it under the cursor, or a
 * finger touches it. Use it to start work a click would otherwise wait for, such as loading
 * data, a lazy component, or an image. Prediction stays off on slow connections and with
 * Save-Data.
 *
 * Returns a callback ref for the element. The latest `onIntent` and options are read when
 * prediction fires, so neither needs to be memoized.
 */
const usePredictedIntent = (
  onIntent: () => void,
  { enabled = true, hitSlop, name, reactivateAfter }: PredictedIntentOptions = {},
) => {
  const { elementRef } = useForesight({
    callback: onIntent,
    enabled,
    hitSlop,
    name,
    reactivateAfter,
  });

  return elementRef;
};

export { usePredictedIntent };

export type { PredictedIntentOptions };
