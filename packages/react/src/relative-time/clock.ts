/* One timer for every relative time on the page, asleep until the earliest one is due. */

interface Subscriber {
  due: number;
  /** When to wake next, in milliseconds since the epoch, or `null` for never. */
  getDue: () => number | null;
  notify: () => void;
}

/** A timer that fires a little early must not spin. */
const MIN_DELAY = 16;

const subscribers = new Set<Subscriber>();

let timer: ReturnType<typeof setTimeout> | undefined;
let timerDue = Number.POSITIVE_INFINITY;

const sleep = () => {
  clearTimeout(timer);
  timerDue = Number.POSITIVE_INFINITY;
};

/** Sets the timer for `due`, unless it already wakes sooner. */
const wakeBy = (due: number) => {
  if (due < timerDue) {
    sleep();
    timerDue = due;
    // oxlint-disable-next-line no-use-before-define -- waking and scheduling call each other.
    timer = setTimeout(wake, Math.max(due - Date.now(), MIN_DELAY));
  }
};

/** Updates the subscribers that are due, or all of them, then schedules the next wake. */
const wake = (all = false) => {
  const now = Date.now();
  sleep();

  for (const subscriber of subscribers) {
    if (all || subscriber.due <= now) {
      subscriber.notify();
      subscriber.due = subscriber.getDue() ?? Number.POSITIVE_INFINITY;
    }

    wakeBy(subscriber.due);
  }
};

// Timers are throttled in a hidden tab and pause while a device sleeps.
const catchUp = () => {
  if (document.visibilityState === "visible") {
    wake(true);
  }
};

/** Calls `notify` whenever the time `getDue` returns arrives. Returns the way to stop. */
const subscribeClock = (getDue: () => number | null, notify: () => void) => {
  const subscriber = { due: getDue() ?? Number.POSITIVE_INFINITY, getDue, notify };

  if (subscribers.size === 0) {
    document.addEventListener("visibilitychange", catchUp);
  }

  subscribers.add(subscriber);
  wakeBy(subscriber.due);

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      sleep();
      document.removeEventListener("visibilitychange", catchUp);
    }
  };
};

export { subscribeClock };
