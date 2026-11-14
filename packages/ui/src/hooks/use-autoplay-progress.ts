import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMotionValue, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";

interface AutoplayProgressOptions {
  /** Index of the current item. A new value restarts the clock at 0. */
  value: number;
  /** Number of items. Fewer than two never advances. */
  count: number;
  /** Time on each item, in milliseconds. */
  duration: number;
  /** Runs the clock. While stopped, progress sits at 1 (a solid fill). */
  playing: boolean;
  /** Holds progress where it is, for example while the pointer is over the content. */
  held?: boolean;
  /** After the last item, go back to the first. Defaults to true. */
  loop?: boolean;
  /** Called with the next index each time the clock finishes an item. */
  onAdvance: (index: number) => void;
  /** Write into this motion value instead of a new one, to share the clock with another part. */
  progress?: MotionValue<number>;
}

/** A frame longer than this is a stall (a background tab), not playback. */
const MAX_FRAME_MS = 100;

/**
 * A frame clock that fills from 0 to 1 over `duration`, then asks for the next item.
 * Progress is a motion value, so it moves every frame without re-rendering.
 * Reduced motion turns the clock off: nothing moves the page on the reader's behalf.
 */
const useAutoplayProgress = ({
  value,
  count,
  duration,
  playing,
  held = false,
  loop = true,
  onAdvance,
  progress: target,
}: AutoplayProgressOptions): MotionValue<number> => {
  const reduceMotion = useReducedMotion() === true;
  const running = playing && !reduceMotion;
  const local = useMotionValue(running ? 0 : 1);
  const progress = target ?? local;
  // Set once the clock has asked for the next item, so it asks once rather than
  // every frame while the owner is slow to (or chooses not to) move on.
  const waiting = useRef(false);

  // Restart whenever the item changes, whoever changed it, or the clock starts or stops.
  const [cycle, setCycle] = useState({ running, value });

  if (cycle.running !== running || cycle.value !== value) {
    setCycle({ running, value });
  }

  useEffect(() => {
    waiting.current = false;
    progress.set(cycle.running ? 0 : 1);
  }, [cycle, progress]);

  const tick = useEffectEvent((elapsed: number) => {
    if (held || waiting.current || count < 2 || elapsed >= MAX_FRAME_MS) {
      return;
    }

    const next = progress.get() + elapsed / duration;

    if (next < 1) {
      progress.set(next);

      return;
    }

    progress.set(1);

    if (loop || value < count - 1) {
      waiting.current = true;
      onAdvance((value + 1) % count);
    }
  });

  useEffect(() => {
    if (!running) {
      return () => {
        // The clock never started.
      };
    }

    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      tick(now - last);
      last = now;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [running]);

  return progress;
};

export { useAutoplayProgress };

export type { AutoplayProgressOptions };
