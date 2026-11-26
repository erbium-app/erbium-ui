/*
 * The stepper's flow as a pure state machine: `reduce(flow, state, event)` returns the next state
 * and the effects to run. No React, no form library, no timers. Guards and `onFinish` run outside
 * the machine: it asks for them with `guard` and `finish` effects and receives their outcomes as
 * events tagged with the token it handed out, so a late answer from a cancelled move changes
 * nothing.
 */

/** A step's stable identity. Never an index, so reordering or hiding steps keeps every status. */
// oxlint-disable-next-line sonarjs/redundant-type-aliases -- names the id in every public signature, as `StepperStep<TId>` does.
type StepperStepId = string;

interface StepperStep<TId extends string = string> {
  readonly id: TId;
  /** The step can be skipped. Steps are required by default. */
  readonly optional?: boolean;
  /** The step is out of the flow, for a step that only applies to some answers. */
  readonly disabled?: boolean;
  /**
   * The step reviews the others before finishing. Only the last enabled step can be one. It has
   * no guard, and it can be entered only once every other step is ready.
   */
  readonly review?: boolean;
  /**
   * In linear navigation, reopening this step reopens every later step too. Turn it off for an
   * optional step whose answer the later steps do not depend on. A required step always reopens
   * the later ones, since they could not be reached without it. @default true
   */
  readonly invalidatesDownstream?: boolean;
}

/**
 * `linear`: a step can be entered only once every required step before it is resolved.
 * `free`: any enabled step can be entered; moving forward still checks the current step.
 */
type StepperNavigation = "linear" | "free";

/** In free navigation, whether the user may leave a step whose check failed. */
type StepperLeaveInvalid = "block" | "allow";

interface StepperFlowOptions {
  /** @default "linear" */
  navigation?: StepperNavigation;
  /** Free navigation only. @default "block" */
  leaveInvalid?: StepperLeaveInvalid;
}

/** The steps compiled once per change, so lookups stay constant time. */
interface StepperFlow {
  readonly steps: readonly StepperStep[];
  readonly navigation: StepperNavigation;
  readonly leaveInvalid: StepperLeaveInvalid;
  /** Enabled steps, in order. */
  readonly enabled: readonly StepperStep[];
  /** Position among the enabled steps. */
  readonly position: ReadonlyMap<StepperStepId, number>;
  /** Position in `steps`, enabled or not. */
  readonly index: ReadonlyMap<StepperStepId, number>;
  /** The review step, when the last enabled step is one. */
  readonly review: StepperStepId | null;
  readonly first: StepperStepId;
  readonly last: StepperStepId;
}

type StepperResolution = "complete" | "skipped";

type StepperPhase =
  | { readonly type: "idle" }
  /** A guard is checking `from`. `to` is `null` when the move finishes the flow. */
  | {
      readonly type: "guarding";
      readonly token: number;
      readonly from: StepperStepId;
      readonly to: StepperStepId | null;
    }
  | { readonly type: "finishing"; readonly token: number }
  | { readonly type: "finished" };

interface StepperState {
  readonly phase: StepperPhase;
  readonly current: StepperStepId;
  /** One map, so a step can never be both complete and skipped. */
  readonly resolution: Readonly<Record<StepperStepId, StepperResolution>>;
  /** A key marks the step invalid. The issues themselves are opaque to the machine. */
  readonly issues: Readonly<Record<StepperStepId, readonly unknown[]>>;
  /** Increases with every move. An outcome carrying an older token is ignored. */
  readonly token: number;
}

/** What a saved flow keeps: enough to resume it. */
interface StepperSnapshot {
  readonly current: StepperStepId;
  readonly resolution: Readonly<Record<StepperStepId, StepperResolution>>;
  readonly issues?: Readonly<Record<StepperStepId, readonly unknown[]>>;
  readonly finished?: boolean;
}

/** Why a move was refused. */
type StepperRejectReason =
  /** Another move is still being checked. */
  | "pending"
  /** The flow has finished. Reset it to move again. */
  | "finished"
  /** No step has that id. */
  | "unknown"
  | "disabled"
  /** The target is already the current step. */
  | "same"
  /** There is no step before the current one. */
  | "first"
  /** Linear navigation: a required step in between is not resolved. */
  | "blocked"
  /** A required step is not resolved, so the flow cannot finish or reach review. */
  | "incomplete"
  /** A step has issues, so the flow cannot finish or reach review. */
  | "invalid"
  /** The current step is required and cannot be skipped. */
  | "required"
  /** A guard or `onFinish` threw. */
  | "error"
  /** The move was cancelled before its check finished. */
  | "cancelled"
  /** The flow changed while `onFinish` ran, so it no longer can finish. */
  | "stale";

/** What every navigation action resolves to. `to` is `null` once the flow has finished. */
type StepperResult =
  | {
      readonly accepted: true;
      readonly from: StepperStepId;
      readonly to: StepperStepId | null;
    }
  | {
      readonly accepted: false;
      readonly reason: StepperRejectReason;
      readonly error?: unknown;
    };

/** Why the current step changed. */
type StepperChangeReason =
  | "next"
  | "previous"
  | "go-to"
  | "skip"
  /** `onFinish` reported issues, so the flow moved to the first failing step. */
  | "finish-failed"
  /** A resolved step was reopened. */
  | "invalidated"
  /** The step list changed. */
  | "steps"
  /** The current step became disabled. */
  | "disabled"
  /** The current step was removed. */
  | "missing"
  /** Linear navigation: the current step can no longer be reached. */
  | "unreachable"
  /** The review step can no longer be shown. */
  | "incomplete"
  | "reset"
  | "restore";

/** A guard's verdict on the current step. */
type StepperGuardOutcome =
  | { readonly status: "valid" }
  /** Resolve an optional step as skipped, for one left untouched. On a required step it is invalid. */
  | { readonly status: "skip" }
  | { readonly status: "invalid"; readonly issues?: readonly unknown[] };

type StepperEvent =
  | { readonly type: "NEXT" }
  | { readonly type: "PREVIOUS" }
  | { readonly type: "GO_TO"; readonly id: StepperStepId }
  | { readonly type: "SKIP" }
  | {
      readonly type: "GUARD_RESOLVED";
      readonly token: number;
      readonly outcome: StepperGuardOutcome;
    }
  | { readonly type: "GUARD_FAILED"; readonly token: number; readonly error?: unknown }
  | { readonly type: "FINISH_RESOLVED"; readonly token: number }
  | {
      readonly type: "FINISH_FAILED";
      readonly token: number;
      /** Issues by step. The flow moves to the earliest step with issues. */
      readonly issues?: Readonly<Record<StepperStepId, readonly unknown[]>>;
      readonly error?: unknown;
    }
  /** Reopens a resolved step, for an answer edited after its step was completed. */
  | { readonly type: "INVALIDATE"; readonly id: StepperStepId }
  | { readonly type: "CLEAR_ISSUES"; readonly id: StepperStepId }
  /** A controlled value changed. It moves without a change effect, since the parent holds it. */
  | { readonly type: "SYNC"; readonly id: StepperStepId }
  | { readonly type: "STEPS"; readonly flow: StepperFlow }
  | {
      readonly type: "RESTORE";
      readonly snapshot: StepperSnapshot;
      readonly reason: "reset" | "restore";
    }
  | { readonly type: "CANCEL" };

type StepperEffect =
  /** Resolves the action that is waiting. */
  | { readonly type: "settle"; readonly result: StepperResult }
  | {
      readonly type: "change";
      readonly from: StepperStepId;
      readonly to: StepperStepId;
      readonly reason: StepperChangeReason;
    }
  /** Run the guard of `from`, then send its outcome with `token`. */
  | {
      readonly type: "guard";
      readonly token: number;
      readonly from: StepperStepId;
      readonly to: StepperStepId | null;
    }
  /** Run `onFinish`, then send its outcome with `token`. */
  | { readonly type: "finish"; readonly token: number };

interface StepperTransition {
  readonly state: StepperState;
  readonly effects: readonly StepperEffect[];
  readonly flow: StepperFlow;
}

// Flow

/** Compiles the steps. Throws for a list no flow can run on. */
const createFlow = (
  steps: readonly StepperStep[],
  { navigation = "linear", leaveInvalid = "block" }: StepperFlowOptions = {},
): StepperFlow => {
  const index = new Map<StepperStepId, number>();

  for (const [at, step] of steps.entries()) {
    if (index.has(step.id)) {
      throw new Error(`Stepper step ids must be unique; "${step.id}" appears twice.`);
    }

    index.set(step.id, at);
  }

  const enabled = steps.filter((step) => step.disabled !== true);
  const first = enabled.at(0);
  const last = enabled.at(-1);

  if (first === undefined || last === undefined) {
    throw new Error("A stepper needs at least one enabled step.");
  }

  const misplaced = enabled.find((step) => step.review === true && step !== last);

  if (misplaced !== undefined) {
    throw new Error(`Only the last enabled step can be a review step; "${misplaced.id}" is not.`);
  }

  const position = new Map(enabled.map((step, at) => [step.id, at]));
  const review = last.review === true && enabled.length > 1 ? last.id : null;

  return {
    enabled,
    index,
    leaveInvalid,
    navigation,
    position,
    review,
    steps,
    first: first.id,
    last: last.id,
  };
};

const STEP_KEYS = ["id", "optional", "disabled", "review", "invalidatesDownstream"] as const;

const sameStep = (a: StepperStep, b: StepperStep) => STEP_KEYS.every((key) => a[key] === b[key]);

const sameSteps = (a: readonly StepperStep[], b: readonly StepperStep[]) =>
  a.length === b.length &&
  a.every((step, at) => {
    const other = b[at];

    return other !== undefined && sameStep(step, other);
  });

/** Whether two flows describe the same steps, so a new array with the same steps changes nothing. */
const isSameFlow = (a: StepperFlow, b: StepperFlow) =>
  a === b ||
  (a.navigation === b.navigation &&
    a.leaveInvalid === b.leaveInvalid &&
    sameSteps(a.steps, b.steps));

// Queries

const has = <T>(record: Readonly<Record<string, T>>, key: string) => Object.hasOwn(record, key);

const stepOf = (flow: StepperFlow, id: StepperStepId): StepperStep | undefined => {
  const at = flow.index.get(id);

  return at === undefined ? undefined : flow.steps[at];
};

/** Position among the enabled steps, or -1 for a disabled or unknown step. */
const positionOf = (flow: StepperFlow, id: StepperStepId) => flow.position.get(id) ?? -1;

/** Whether the step must be resolved before the flow can finish. The review step never is. */
const needsResolution = (flow: StepperFlow, step: StepperStep) =>
  step.optional !== true && step.id !== flow.review;

type Readiness = "ok" | "incomplete" | "invalid";

/** Whether the flow could finish, ignoring `except`: the step whose guard is about to run. */
const readiness = (
  flow: StepperFlow,
  state: Pick<StepperState, "resolution" | "issues">,
  except: StepperStepId | null,
): Readiness => {
  const others = flow.enabled.filter((step) => step.id !== except);

  if (others.some((step) => needsResolution(flow, step) && !has(state.resolution, step.id))) {
    return "incomplete";
  }

  return others.some((step) => has(state.issues, step.id)) ? "invalid" : "ok";
};

/** The first enabled step a linear flow cannot pass: unresolved and required. */
const frontierOf = (flow: StepperFlow, resolution: StepperState["resolution"]): StepperStepId =>
  flow.enabled.find((step) => needsResolution(flow, step) && !has(resolution, step.id))?.id ??
  flow.last;

/** The first step that keeps the flow from finishing, for leaving a review it cannot show. */
const blockerOf = (flow: StepperFlow, state: Pick<StepperState, "resolution" | "issues">) =>
  flow.enabled.find(
    (step) =>
      (needsResolution(flow, step) && !has(state.resolution, step.id)) ||
      has(state.issues, step.id),
  )?.id ?? flow.first;

const isPending = (state: StepperState) =>
  state.phase.type === "guarding" || state.phase.type === "finishing";

/** Why a move forward to `to` would be refused before its guard runs, or `null`. */
const forwardBlock = (
  flow: StepperFlow,
  state: StepperState,
  to: StepperStepId,
): StepperRejectReason | null => {
  const from = positionOf(flow, state.current);
  const target = positionOf(flow, to);

  if (flow.navigation === "linear") {
    const skipped = flow.enabled
      .slice(from + 1, target)
      .some((step) => needsResolution(flow, step) && !has(state.resolution, step.id));

    if (skipped) {
      return "blocked";
    }
  }

  if (to === flow.review) {
    const ready = readiness(flow, state, state.current);

    return ready === "ok" ? null : ready;
  }

  return null;
};

/**
 * Why moving to `id` would be refused before any guard runs, or `null` when the move would start.
 * The parts use it to disable triggers, with the same rules the reducer applies.
 */
const getGoToBlock = (
  flow: StepperFlow,
  state: StepperState,
  id: StepperStepId,
): StepperRejectReason | null => {
  if (isPending(state)) {
    return "pending";
  }

  if (state.phase.type === "finished") {
    return "finished";
  }

  const step = stepOf(flow, id);

  if (step === undefined) {
    return "unknown";
  }

  if (step.disabled === true) {
    return "disabled";
  }

  if (id === state.current) {
    return "same";
  }

  return positionOf(flow, id) < positionOf(flow, state.current)
    ? null
    : forwardBlock(flow, state, id);
};

/** Why Next would be refused before its guard runs, or `null`. */
const getNextBlock = (flow: StepperFlow, state: StepperState): StepperRejectReason | null => {
  if (isPending(state)) {
    return "pending";
  }

  if (state.phase.type === "finished") {
    return "finished";
  }

  if (state.current === flow.last) {
    const ready = readiness(flow, state, state.current === flow.review ? null : state.current);

    return ready === "ok" ? null : ready;
  }

  const next = flow.enabled[positionOf(flow, state.current) + 1];

  return next === undefined ? null : forwardBlock(flow, state, next.id);
};

/** Why Previous would be refused, or `null`. */
const getPreviousBlock = (flow: StepperFlow, state: StepperState): StepperRejectReason | null => {
  if (isPending(state)) {
    return "pending";
  }

  if (state.phase.type === "finished") {
    return "finished";
  }

  return state.current === flow.first ? "first" : null;
};

/** The state Skip would leave behind: the current step resolved as skipped. */
const skippedDraft = (state: StepperState): StepperState => ({
  ...state,
  issues: omit(state.issues, state.current),
  resolution: { ...state.resolution, [state.current]: "skipped" },
});

/** Why Skip would be refused, or `null`. */
const getSkipBlock = (flow: StepperFlow, state: StepperState): StepperRejectReason | null => {
  if (isPending(state)) {
    return "pending";
  }

  if (state.phase.type === "finished") {
    return "finished";
  }

  if (stepOf(flow, state.current)?.optional !== true) {
    return "required";
  }

  const next = flow.enabled[positionOf(flow, state.current) + 1];

  if (next === undefined || next.id === flow.review) {
    const ready = readiness(flow, skippedDraft(state), null);

    return ready === "ok" ? null : ready;
  }

  return null;
};

type StepperStepStatus = "current" | "complete" | "skipped" | "pending";

/** A step's status. Derived, never stored: current wins, then its resolution. */
const getStepStatus = (state: StepperState, id: StepperStepId): StepperStepStatus => {
  if (id === state.current) {
    return "current";
  }

  return state.resolution[id] ?? "pending";
};

/**
 * What the user has done with step `id`, wherever they are now. Unlike the status, a step the
 * user went back to keeps its resolution, so its connector stays filled.
 */
const getStepResolution = (state: StepperState, id: StepperStepId): StepperResolution | "pending" =>
  state.resolution[id] ?? "pending";

/**
 * Whether the user has got as far as step `id`: it is current or resolved, or the enabled step
 * before it is resolved. A step the user left by going back stays reached, so its connector and
 * its mark agree.
 */
const isStepReached = (flow: StepperFlow, state: StepperState, id: StepperStepId): boolean => {
  const at = positionOf(flow, id);

  if (at < 0) {
    return false;
  }

  const before = flow.enabled[at - 1];

  return (
    id === state.current ||
    has(state.resolution, id) ||
    before === undefined ||
    has(state.resolution, before.id)
  );
};

// Transitions

const omit = <T>(record: Readonly<Record<string, T>>, key: string): Record<string, T> => {
  const { [key]: _removed, ...rest } = record;

  return rest;
};

const sameRecord = <T>(a: Readonly<Record<string, T>>, b: Readonly<Record<string, T>>) => {
  const keys = Object.keys(a);

  return (
    keys.length === Object.keys(b).length && keys.every((key) => has(b, key) && a[key] === b[key])
  );
};

/** Reopens a step, and in linear navigation the steps after it. Returns `state` when nothing changes. */
const dropResolution = (flow: StepperFlow, state: StepperState, id: StepperStepId) => {
  const at = flow.index.get(id);
  const step = stepOf(flow, id);

  if (at === undefined || step === undefined) {
    return state;
  }

  const downstream =
    flow.navigation === "linear" &&
    (step.invalidatesDownstream !== false || step.optional !== true);

  const reopened = downstream ? flow.steps.slice(at).map((other) => other.id) : [id];
  const kept = reopened.filter((other) => has(state.resolution, other));

  if (kept.length === 0) {
    return state;
  }

  let { resolution } = state;

  for (const other of kept) {
    resolution = omit(resolution, other);
  }

  return { ...state, resolution };
};

interface Normalized {
  state: StepperState;
  reason: StepperChangeReason | null;
}

/** Resolutions that fit `flow`: real steps only, skipped only when optional, a linear prefix. */
const fitResolution = (flow: StepperFlow, resolution: StepperState["resolution"]) => {
  const fitted: Record<StepperStepId, StepperResolution> = {};
  let blocked = false;

  for (const step of flow.steps) {
    const value = resolution[step.id];

    const allowed =
      value !== undefined &&
      step.id !== flow.review &&
      (value === "complete" || step.optional === true);

    if (allowed && !blocked) {
      fitted[step.id] = value;
    }

    // In linear navigation nothing after an unresolved required step can be resolved.
    const gap = step.disabled !== true && needsResolution(flow, step) && !allowed;

    blocked ||= flow.navigation === "linear" && gap;
  }

  return fitted;
};

/** Issues that fit `flow`: on enabled steps that are not resolved and are not the review. */
const fitIssues = (
  flow: StepperFlow,
  issues: StepperState["issues"],
  resolution: StepperState["resolution"],
) =>
  Object.fromEntries(
    Object.entries(issues).filter(
      ([id]) => flow.position.has(id) && id !== flow.review && !has(resolution, id),
    ),
  );

/** Where a step that left the flow lands: the fallback, else the linear frontier or the first. */
const landing = (
  flow: StepperFlow,
  resolution: StepperState["resolution"],
  fallback: StepperStepId | null,
) => {
  if (fallback !== null && flow.position.has(fallback)) {
    return fallback;
  }

  return flow.navigation === "linear" ? frontierOf(flow, resolution) : flow.first;
};

interface Placement {
  current: StepperStepId;
  reason: StepperChangeReason | null;
}

/** The current step that fits `flow`, and why it moved. */
const fitCurrent = (
  flow: StepperFlow,
  current: StepperStepId,
  fitted: Pick<StepperState, "resolution" | "issues">,
  fallback: StepperStepId | null,
): Placement => {
  if (!flow.position.has(current)) {
    const reason = flow.index.has(current) ? "disabled" : "missing";

    // The first reason wins: the step left, even if where it lands moves again.
    return {
      ...fitCurrent(flow, landing(flow, fitted.resolution, fallback), fitted, null),
      reason,
    };
  }

  const frontier = frontierOf(flow, fitted.resolution);

  if (flow.navigation === "linear" && positionOf(flow, current) > positionOf(flow, frontier)) {
    return { ...fitCurrent(flow, frontier, fitted, null), reason: "unreachable" };
  }

  if (current === flow.review && readiness(flow, fitted, null) !== "ok") {
    return { current: blockerOf(flow, fitted), reason: "incomplete" };
  }

  return { current, reason: null };
};

/**
 * Brings a state in line with every invariant for `flow`. Idempotent, and returns the same state
 * object when nothing changes. `fallback` is where a removed current step should land.
 */
const normalize = (
  flow: StepperFlow,
  state: StepperState,
  fallback: StepperStepId | null = null,
): Normalized => {
  const resolution = fitResolution(flow, state.resolution);
  const issues = fitIssues(flow, state.issues, resolution);
  const fitted = { issues, resolution };
  const { current, reason } = fitCurrent(flow, state.current, fitted, fallback);
  const finishable = readiness(flow, fitted, null) === "ok" && current === flow.last;

  const phase: StepperPhase =
    state.phase.type === "finished" && !finishable ? { type: "idle" } : state.phase;

  const same =
    phase === state.phase &&
    current === state.current &&
    sameRecord(resolution, state.resolution) &&
    sameRecord(issues, state.issues);

  return { reason, state: same ? state : { ...state, current, issues, phase, resolution } };
};

/** The first state for `flow`, optionally resuming a snapshot. */
const createInitialState = (flow: StepperFlow, snapshot?: Partial<StepperSnapshot>): StepperState =>
  normalize(flow, {
    current: snapshot?.current ?? flow.first,
    issues: snapshot?.issues ?? {},
    phase: snapshot?.finished === true ? { type: "finished" } : { type: "idle" },
    resolution: snapshot?.resolution ?? {},
    token: 0,
  }).state;

/** What a snapshot keeps of a state. */
const getSnapshot = (state: StepperState): StepperSnapshot => ({
  current: state.current,
  finished: state.phase.type === "finished",
  issues: state.issues,
  resolution: state.resolution,
});

type Outcome =
  | { accepted: true }
  | { accepted: false; reason: StepperRejectReason; error?: unknown };

const resultOf = (before: StepperState, after: StepperState, outcome: Outcome): StepperResult => {
  if (outcome.accepted) {
    return { accepted: true, from: before.current, to: after.current };
  }

  return outcome.error === undefined
    ? { accepted: false, reason: outcome.reason }
    : { accepted: false, error: outcome.error, reason: outcome.reason };
};

const settle = (before: StepperState, after: StepperState, outcome: Outcome): StepperEffect => ({
  result: resultOf(before, after, outcome),
  type: "settle",
});

/** Normalizes a draft, then reports the change of step, if any, and settles the action. */
const finalize = (
  flow: StepperFlow,
  draft: StepperState,
  before: StepperState,
  why: StepperChangeReason,
  outcome: Outcome | null,
  {
    fallback = null,
    cancelled = [],
  }: { fallback?: StepperStepId | null; cancelled?: StepperEffect[] } = {},
): StepperTransition => {
  const normalized = normalize(flow, draft, fallback);
  const effects: StepperEffect[] = [...cancelled];

  if (normalized.state.current !== before.current) {
    effects.push({
      from: before.current,
      reason: normalized.reason ?? why,
      to: normalized.state.current,
      type: "change",
    });
  }

  if (outcome !== null) {
    effects.push(settle(before, normalized.state, outcome));
  }

  return { effects, flow, state: normalized.state };
};

const transition = (
  flow: StepperFlow,
  state: StepperState,
  effects: readonly StepperEffect[] = [],
): StepperTransition => ({ effects, flow, state });

const unchanged = (flow: StepperFlow, state: StepperState) => transition(flow, state);

const rejected = (
  flow: StepperFlow,
  state: StepperState,
  reason: StepperRejectReason,
): StepperTransition =>
  transition(flow, state, [{ result: { reason, accepted: false }, type: "settle" }]);

/** Stops a running move. Its action settles as cancelled and its late outcome is ignored. */
interface Stopped {
  state: StepperState;
  effects: StepperEffect[];
}

const cancelMove = (state: StepperState, finishing: boolean): Stopped => {
  const running =
    state.phase.type === "guarding" || (finishing && state.phase.type === "finishing");

  if (!running) {
    return { effects: [], state };
  }

  return {
    effects: [{ result: { accepted: false, reason: "cancelled" }, type: "settle" }],
    state: { ...state, phase: { type: "idle" }, token: state.token + 1 },
  };
};

const startGuard = (
  flow: StepperFlow,
  state: StepperState,
  to: StepperStepId | null,
): StepperTransition => {
  const token = state.token + 1;

  const from = state.current;

  return transition(flow, { ...state, token, phase: { from, to, token, type: "guarding" } }, [
    { from, to, token, type: "guard" },
  ]);
};

const startFinish = (flow: StepperFlow, state: StepperState): StepperTransition => {
  const token = state.token + 1;

  return transition(flow, { ...state, token, phase: { token, type: "finishing" } }, [
    { token, type: "finish" },
  ]);
};

const move = (
  flow: StepperFlow,
  state: StepperState,
  to: StepperStepId,
  why: StepperChangeReason,
) => finalize(flow, { ...state, current: to }, state, why, { accepted: true });

type NavigationType = "NEXT" | "PREVIOUS" | "GO_TO" | "SKIP";

type NavigationEvent = Extract<StepperEvent, { type: NavigationType }>;

const navigate = (flow: StepperFlow, state: StepperState, event: NavigationEvent) => {
  const at = positionOf(flow, state.current);

  switch (event.type) {
    case "PREVIOUS": {
      const block = getPreviousBlock(flow, state);
      const previous = flow.enabled[at - 1];

      return block !== null || previous === undefined
        ? rejected(flow, state, block ?? "first")
        : move(flow, state, previous.id, "previous");
    }

    case "SKIP": {
      const block = getSkipBlock(flow, state);

      if (block !== null) {
        return rejected(flow, state, block);
      }

      const draft = skippedDraft(state);
      const next = flow.enabled[at + 1];

      return next === undefined
        ? startFinish(flow, draft)
        : finalize(flow, { ...draft, current: next.id }, state, "skip", { accepted: true });
    }

    case "NEXT": {
      const block = getNextBlock(flow, state);

      if (block !== null) {
        return rejected(flow, state, block);
      }

      if (state.current === flow.review) {
        return startFinish(flow, state);
      }

      return startGuard(flow, state, flow.enabled[at + 1]?.id ?? null);
    }

    case "GO_TO": {
      const block = getGoToBlock(flow, state, event.id);

      if (block !== null) {
        return rejected(flow, state, block);
      }

      return positionOf(flow, event.id) < at
        ? move(flow, state, event.id, "go-to")
        : startGuard(flow, state, event.id);
    }

    default: {
      return unchanged(flow, state);
    }
  }
};

const isLive = (state: StepperState, phase: "guarding" | "finishing", token: number) =>
  state.phase.type === phase && state.phase.token === token;

const resolveGuard = (
  flow: StepperFlow,
  state: StepperState,
  outcome: StepperGuardOutcome,
): StepperTransition => {
  if (state.phase.type !== "guarding") {
    return unchanged(flow, state);
  }

  const { from, to } = state.phase;
  const idle: StepperState = { ...state, phase: { type: "idle" } };
  const why = to === flow.enabled[positionOf(flow, from) + 1]?.id ? "next" : "go-to";

  // A required step cannot be skipped, so a guard that tries reports it invalid.
  const verdict =
    outcome.status === "skip" && stepOf(flow, from)?.optional !== true ? "invalid" : outcome.status;

  if (verdict === "invalid") {
    const reopened = dropResolution(flow, idle, from);
    const issues = outcome.status === "invalid" ? (outcome.issues ?? []) : [];
    const marked: StepperState = { ...reopened, issues: { ...reopened.issues, [from]: issues } };

    // Free navigation may leave an invalid step, but never into a review it would fail.
    if (
      flow.navigation === "free" &&
      flow.leaveInvalid === "allow" &&
      to !== null &&
      to !== flow.review
    ) {
      return finalize(flow, { ...marked, current: to }, state, why, { accepted: true });
    }

    return finalize(flow, marked, state, why, { accepted: false, reason: "invalid" });
  }

  const resolved: StepperState = {
    ...idle,
    issues: omit(idle.issues, from),
    resolution: { ...idle.resolution, [from]: verdict === "valid" ? "complete" : "skipped" },
  };

  if (to === null || to === flow.review) {
    const ready = readiness(flow, resolved, null);

    if (ready !== "ok") {
      return finalize(flow, resolved, state, "next", { accepted: false, reason: ready });
    }

    if (to === null) {
      // The action stays pending until `onFinish` answers.
      return startFinish(flow, resolved);
    }
  }

  return finalize(flow, { ...resolved, current: to }, state, why, { accepted: true });
};

const failFinish = (
  flow: StepperFlow,
  state: StepperState,
  event: Extract<StepperEvent, { type: "FINISH_FAILED" }>,
): StepperTransition => {
  const failing = Object.entries(event.issues ?? {})
    .filter(([id]) => flow.position.has(id) && id !== flow.review)
    .toSorted(([a], [b]) => positionOf(flow, a) - positionOf(flow, b));

  let draft: StepperState = { ...state, phase: { type: "idle" } };

  for (const [id, issues] of failing) {
    draft = dropResolution(flow, draft, id);
    draft = { ...draft, issues: { ...draft.issues, [id]: issues } };
  }

  const earliest = failing[0]?.[0];

  if (earliest !== undefined) {
    draft = { ...draft, current: earliest };
  }

  const reason = earliest === undefined ? "error" : "invalid";

  return finalize(flow, draft, state, "finish-failed", {
    accepted: false,
    error: event.error,
    reason,
  });
};

/** Where a flow lands when its current step disappears: the nearest earlier step that remains. */
const fallbackFor = (previous: StepperFlow, next: StepperFlow, current: StepperStepId) => {
  const at = previous.index.get(current) ?? 0;

  return (
    previous.steps
      .slice(0, at)
      .toReversed()
      .find((step) => next.position.has(step.id))?.id ?? null
  );
};

const failGuard = (
  flow: StepperFlow,
  state: StepperState,
  { error }: Extract<StepperEvent, { type: "GUARD_FAILED" }>,
) => {
  const idle: StepperState = { ...state, phase: { type: "idle" } };

  return transition(flow, idle, [settle(state, idle, { error, accepted: false, reason: "error" })]);
};

/** `onFinish` succeeded. The flow finishes unless it changed underneath, which makes it stale. */
const completeFinish = (flow: StepperFlow, state: StepperState): StepperTransition => {
  if (readiness(flow, state, null) === "ok" && state.current === flow.last) {
    return transition(flow, { ...state, phase: { type: "finished" } }, [
      { result: { accepted: true, from: state.current, to: null }, type: "settle" },
    ]);
  }

  return transition(flow, { ...state, phase: { type: "idle" } }, [
    { result: { accepted: false, reason: "stale" }, type: "settle" },
  ]);
};

const invalidate = (flow: StepperFlow, state: StepperState, id: StepperStepId) => {
  const reopened = dropResolution(flow, state, id);

  // Reopening nothing must not cancel the running move.
  if (reopened === state) {
    return unchanged(flow, state);
  }

  const stopped = cancelMove(reopened, false);

  return finalize(flow, stopped.state, state, "invalidated", null, {
    cancelled: stopped.effects,
  });
};

/** Whether a controlled value can be applied: a different, enabled, reachable step while idle. */
const canSync = (flow: StepperFlow, state: StepperState, id: StepperStepId) => {
  if (state.phase.type === "finishing" || state.phase.type === "finished") {
    return false;
  }

  if (id === state.current || !flow.position.has(id)) {
    return false;
  }

  const frontier = frontierOf(flow, state.resolution);

  if (flow.navigation === "linear" && positionOf(flow, id) > positionOf(flow, frontier)) {
    return false;
  }

  return id !== flow.review || readiness(flow, state, null) === "ok";
};

const sync = (flow: StepperFlow, state: StepperState, id: StepperStepId): StepperTransition => {
  if (!canSync(flow, state, id)) {
    return unchanged(flow, state);
  }

  const stopped = cancelMove(state, false);

  // The parent already holds the new value, so no change is reported.
  return transition(
    flow,
    normalize(flow, { ...stopped.state, current: id }).state,
    stopped.effects,
  );
};

const replaceSteps = (flow: StepperFlow, state: StepperState, next: StepperFlow) => {
  if (isSameFlow(flow, next)) {
    return unchanged(flow, state);
  }

  const stopped = cancelMove(state, false);

  return finalize(next, stopped.state, state, "steps", null, {
    cancelled: stopped.effects,
    fallback: fallbackFor(flow, next, state.current),
  });
};

const restore = (
  flow: StepperFlow,
  state: StepperState,
  { snapshot, reason }: Extract<StepperEvent, { type: "RESTORE" }>,
) => {
  const stopped = cancelMove(state, true);
  const restored = createInitialState(flow, snapshot);

  return finalize(flow, { ...restored, token: stopped.state.token + 1 }, state, reason, null, {
    cancelled: stopped.effects,
  });
};

type RunOutcomeType = "GUARD_RESOLVED" | "GUARD_FAILED" | "FINISH_RESOLVED" | "FINISH_FAILED";

/** Outcomes of a guard or `onFinish`. One carrying a stale token changes nothing. */
const settleRun = (
  flow: StepperFlow,
  state: StepperState,
  event: Extract<StepperEvent, { type: RunOutcomeType }>,
): StepperTransition => {
  const phase =
    event.type === "GUARD_RESOLVED" || event.type === "GUARD_FAILED" ? "guarding" : "finishing";

  if (!isLive(state, phase, event.token)) {
    return unchanged(flow, state);
  }

  switch (event.type) {
    case "GUARD_RESOLVED": {
      return resolveGuard(flow, state, event.outcome);
    }

    case "GUARD_FAILED": {
      return failGuard(flow, state, event);
    }

    case "FINISH_RESOLVED": {
      return completeFinish(flow, state);
    }

    case "FINISH_FAILED": {
      return failFinish(flow, state, event);
    }

    default: {
      return unchanged(flow, state);
    }
  }
};

/** The machine. Total: every event is handled in every phase. */
const reduce = (flow: StepperFlow, state: StepperState, event: StepperEvent): StepperTransition => {
  switch (event.type) {
    case "NEXT":
    case "PREVIOUS":
    case "GO_TO":
    case "SKIP": {
      return navigate(flow, state, event);
    }

    case "GUARD_RESOLVED":
    case "GUARD_FAILED":
    case "FINISH_RESOLVED":
    case "FINISH_FAILED": {
      return settleRun(flow, state, event);
    }

    case "INVALIDATE": {
      return invalidate(flow, state, event.id);
    }

    case "CLEAR_ISSUES": {
      return unchanged(
        flow,
        has(state.issues, event.id) ? { ...state, issues: omit(state.issues, event.id) } : state,
      );
    }

    case "SYNC": {
      return sync(flow, state, event.id);
    }

    case "STEPS": {
      return replaceSteps(flow, state, event.flow);
    }

    case "RESTORE": {
      return restore(flow, state, event);
    }

    case "CANCEL": {
      const stopped = cancelMove(state, true);

      return transition(flow, stopped.state, stopped.effects);
    }

    default: {
      return unchanged(flow, state);
    }
  }
};

export {
  createFlow,
  createInitialState,
  getGoToBlock,
  getNextBlock,
  getPreviousBlock,
  getSkipBlock,
  getSnapshot,
  getStepResolution,
  getStepStatus,
  isStepReached,
  isPending,
  isSameFlow,
  reduce,
};

export type {
  StepperChangeReason,
  StepperEffect,
  StepperEvent,
  StepperFlow,
  StepperFlowOptions,
  StepperGuardOutcome,
  StepperLeaveInvalid,
  StepperNavigation,
  StepperPhase,
  StepperRejectReason,
  StepperResolution,
  StepperResult,
  StepperSnapshot,
  StepperState,
  StepperStep,
  StepperStepId,
  StepperStepStatus,
  StepperTransition,
};
