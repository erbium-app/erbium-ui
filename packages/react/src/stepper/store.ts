/*
 * Runs the machine: holds its state, runs the guards and `onFinish` it asks for, and resolves each
 * action's promise from its `settle` effect. Framework-free, so React only subscribes to it.
 */
import { createInitialState, getSnapshot, isPending, reduce } from "./core";
import type {
  StepperChangeReason,
  StepperEffect,
  StepperEvent,
  StepperFlow,
  StepperGuardOutcome,
  StepperResult,
  StepperSnapshot,
  StepperState,
  StepperStepId,
} from "./core";

/** What a guard is asked to check. */
interface StepperGuardContext {
  /** The step being checked: always the current one. */
  step: StepperStepId;
  /** Where the move goes, or `null` when it finishes the flow. */
  to: StepperStepId | null;
  /** Aborted when the move is cancelled, reset or unmounted. */
  signal: AbortSignal;
}

/** `true` means valid and `false` invalid. An outcome can also skip or carry issues. */
type StepperGuardVerdict = StepperGuardOutcome | boolean;

/**
 * Checks the current step before moving forward or finishing. Throwing rejects the move with
 * `error`.
 */
type StepperGuard = (
  context: StepperGuardContext,
) => StepperGuardVerdict | Promise<StepperGuardVerdict>;

/** `onFinish` reports issues by step to send the user back to the first failing one. */
interface StepperFinishFailure {
  issues: Readonly<Record<StepperStepId, readonly unknown[]>>;
}

/** Nothing on success, so a plain `async () => { await save(); }` is a finish. */
// oxlint-disable-next-line typescript/no-invalid-void-type -- `undefined` would reject callbacks that return nothing, such as `async () => { await save(); }`, whose type is `Promise<void>`.
type StepperFinishResult = StepperFinishFailure | void;

type StepperFinish = (context: {
  signal: AbortSignal;
}) => StepperFinishResult | Promise<StepperFinishResult>;

interface StepperChangeDetails {
  reason: StepperChangeReason;
  /** The step that was current before. */
  from: StepperStepId;
}

interface StepperCallbacks {
  /** Runs for the current step when it has no guard of its own. */
  guard?: StepperGuard;
  onFinish?: StepperFinish;
  onValueChange?: (value: StepperStepId, details: StepperChangeDetails) => void;
}

interface StepperView {
  flow: StepperFlow;
  state: StepperState;
}

interface StepperStore {
  get: () => StepperView;
  subscribe: (listener: () => void) => () => void;
  next: () => Promise<StepperResult>;
  previous: () => Promise<StepperResult>;
  goTo: (id: StepperStepId) => Promise<StepperResult>;
  skip: () => Promise<StepperResult>;
  /** Reopens a resolved step, for an answer edited after it was completed. */
  invalidate: (id: StepperStepId) => void;
  clearIssues: (id: StepperStepId) => void;
  /** Returns to the initial state, cancelling a running move. */
  reset: () => void;
  restore: (snapshot: StepperSnapshot) => void;
  snapshot: () => StepperSnapshot;
  /** Cancels a running guard or finish. Its action resolves as `cancelled`. */
  cancel: () => void;
  /** Registers a step's own guard. Returns the function that removes it. */
  registerGuard: (id: StepperStepId, guard: StepperGuard) => () => void;
  /** Applies a controlled value. Returns whether the flow is now on it. */
  sync: (id: StepperStepId) => boolean;
  setFlow: (flow: StepperFlow) => void;
  setCallbacks: (callbacks: StepperCallbacks) => void;
}

const toOutcome = (verdict: StepperGuardVerdict): StepperGuardOutcome => {
  if (verdict === true) {
    return { status: "valid" };
  }

  return verdict === false ? { status: "invalid" } : verdict;
};

const createStepperStore = (
  initialFlow: StepperFlow,
  initial: Partial<StepperSnapshot> = {},
): StepperStore => {
  let view: StepperView = { flow: initialFlow, state: createInitialState(initialFlow, initial) };
  let callbacks: StepperCallbacks = {};
  const listeners = new Set<() => void>();
  const guards = new Map<StepperStepId, StepperGuard>();
  /** The action waiting on the running guard or finish. */
  let waiting: ((result: StepperResult) => void) | null = null;
  let controller: AbortController | null = null;
  const queue: StepperEvent[] = [];
  let draining = false;

  const abortRun = () => {
    controller?.abort();
    controller = null;
  };

  const runGuard = (effect: Extract<StepperEffect, { type: "guard" }>) => {
    const guard = guards.get(effect.from) ?? callbacks.guard;

    if (guard === undefined) {
      queue.push({ outcome: { status: "valid" }, token: effect.token, type: "GUARD_RESOLVED" });

      return;
    }

    controller = new AbortController();
    const { signal } = controller;
    const { token } = effect;

    void (async () => {
      try {
        const verdict = await guard({ signal, step: effect.from, to: effect.to });

        dispatch({ token, outcome: toOutcome(verdict), type: "GUARD_RESOLVED" });
      } catch (error) {
        dispatch({ error, token, type: "GUARD_FAILED" });
      }
    })();
  };

  const runFinish = (effect: Extract<StepperEffect, { type: "finish" }>) => {
    const finish = callbacks.onFinish;

    if (finish === undefined) {
      queue.push({ token: effect.token, type: "FINISH_RESOLVED" });

      return;
    }

    controller = new AbortController();
    const { signal } = controller;
    const { token } = effect;

    void (async () => {
      try {
        const failure = await finish({ signal });

        dispatch(
          failure === undefined
            ? { token, type: "FINISH_RESOLVED" }
            : { token, issues: failure.issues, type: "FINISH_FAILED" },
        );
      } catch (error) {
        dispatch({ error, token, type: "FINISH_FAILED" });
      }
    })();
  };

  const apply = (effect: StepperEffect, own: ((result: StepperResult) => void) | null) => {
    switch (effect.type) {
      case "settle": {
        // A navigation event settled itself, unless a move was already waiting.
        if (own === null) {
          abortRun();
          const resolve = waiting;
          waiting = null;
          resolve?.(effect.result);
        } else {
          own(effect.result);
        }

        break;
      }

      case "change": {
        callbacks.onValueChange?.(effect.to, { from: effect.from, reason: effect.reason });
        break;
      }

      case "guard": {
        runGuard(effect);
        break;
      }

      case "finish": {
        runFinish(effect);
        break;
      }

      default: {
        break;
      }
    }
  };

  const process = (event: StepperEvent, own: ((result: StepperResult) => void) | null) => {
    const before = view.state;
    const out = reduce(view.flow, view.state, event);

    if (out.state !== view.state || out.flow !== view.flow) {
      view = { flow: out.flow, state: out.state };
    }

    // A navigation event while a move runs is refused; it settles its own promise.
    const settlesOwn = own !== null && (isPending(before) || !isPending(out.state));

    for (const effect of out.effects) {
      apply(effect, effect.type === "settle" && settlesOwn ? own : null);
    }

    // A navigation event that started a move waits for it.
    if (own !== null && !isPending(before) && isPending(out.state)) {
      waiting = own;
    }
  };

  /** Events run one at a time, so effects that dispatch never re-enter the reducer. */
  const dispatch = (event: StepperEvent, own: ((result: StepperResult) => void) | null = null) => {
    const before = view;
    process(event, own);

    if (draining) {
      return;
    }

    draining = true;

    for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
      process(next, null);
    }

    draining = false;

    if (view !== before) {
      for (const listener of listeners) {
        listener();
      }
    }
  };

  const navigate = async (event: StepperEvent) =>
    // oxlint-disable-next-line promise/avoid-new -- the action settles from a reducer effect, not a callback API, so it needs its resolver; ES2023 has no Promise.withResolvers.
    await new Promise<StepperResult>((resolve) => {
      dispatch(event, resolve);
    });

  return {
    cancel: () => {
      dispatch({ type: "CANCEL" });
    },
    clearIssues: (id) => {
      dispatch({ id, type: "CLEAR_ISSUES" });
    },
    get: () => view,
    goTo: async (id) => await navigate({ id, type: "GO_TO" }),
    invalidate: (id) => {
      dispatch({ id, type: "INVALIDATE" });
    },
    next: async () => await navigate({ type: "NEXT" }),
    previous: async () => await navigate({ type: "PREVIOUS" }),
    registerGuard: (id, guard) => {
      guards.set(id, guard);

      return () => {
        if (guards.get(id) === guard) {
          guards.delete(id);
        }
      };
    },
    reset: () => {
      dispatch({
        reason: "reset",
        snapshot: { current: view.flow.first, resolution: {}, ...initial },
        type: "RESTORE",
      });
    },
    restore: (snapshot) => {
      dispatch({ snapshot, reason: "restore", type: "RESTORE" });
    },
    setCallbacks: (next) => {
      callbacks = next;
    },
    setFlow: (flow) => {
      dispatch({ flow, type: "STEPS" });
    },
    skip: async () => await navigate({ type: "SKIP" }),
    snapshot: () => getSnapshot(view.state),
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    sync: (id) => {
      dispatch({ id, type: "SYNC" });

      return view.state.current === id;
    },
  };
};

export { createStepperStore };

export type {
  StepperFinishResult,
  StepperGuardVerdict,
  StepperCallbacks,
  StepperChangeDetails,
  StepperFinish,
  StepperFinishFailure,
  StepperGuard,
  StepperGuardContext,
  StepperStore,
  StepperView,
};
