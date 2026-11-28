/*
 * One timer for every relative time on the page. Each subscriber says when its text can next
 * change, and the timer sleeps until the earliest of those.
 */

interface Subscriber {
  /** When to wake this subscriber, in milliseconds since the epoch, or `null` for never. */
  due: number | null;
  getDue: () => number | null;
  notify: () => void;
}

/** A timer that fires a little early must not spin. */
const MIN_DELAY = 16;

/** Waking at least this often recovers from a clock that was set back. */
const MAX_DELAY = 15 * 60 * 1000;

const subscribers = new Set<Subscriber>();

let timer: ReturnType<typeof setTimeout> | undefined;
let timerDue = Number.POSITIVE_INFINITY;

const stop = () => {
  clearTimeout(timer);
  timerDue = Number.POSITIVE_INFINITY;
};

const update = (subscriber: Subscriber) => {
  subscriber.notify();
  subscriber.due = subscriber.getDue();
};

const wakeAt = (due: number) => {
  stop();
  timerDue = due;

  const delay = Math.min(Math.max(due - Date.now(), MIN_DELAY), MAX_DELAY);

  timer = setTimeout(() => {
    const now = Date.now();

    for (const subscriber of subscribers) {
      if (subscriber.due !== null && subscriber.due <= now) {
        update(subscriber);
      }
    }

    // oxlint-disable-next-line no-use-before-define -- the timer and its scheduler call each other.
    schedule();
  }, delay);
};

const schedule = () => {
  let next = Number.POSITIVE_INFINITY;

  for (const { due } of subscribers) {
    next = Math.min(next, due ?? next);
  }

  stop();

  if (next !== Number.POSITIVE_INFINITY) {
    wakeAt(next);
  }
};

// Timers are throttled in a hidden tab and pause while a device sleeps.
const catchUp = () => {
  if (document.visibilityState === "visible") {
    for (const subscriber of subscribers) {
      update(subscriber);
    }

    schedule();
  }
};

/** Calls `notify` whenever the time `getDue` returns arrives. Returns the way to stop. */
const subscribeClock = (getDue: () => number | null, notify: () => void) => {
  const subscriber: Subscriber = { due: getDue(), getDue, notify };

  if (subscribers.size === 0) {
    document.addEventListener("visibilitychange", catchUp);
  }

  subscribers.add(subscriber);

  if (subscriber.due !== null && subscriber.due < timerDue) {
    wakeAt(subscriber.due);
  }

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      stop();
      document.removeEventListener("visibilitychange", catchUp);
    }
  };
};

export { subscribeClock };
