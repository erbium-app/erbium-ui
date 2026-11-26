/*
 * A model checker for the stepper machine. It explores every reachable state of small flows,
 * checks each transition against invariants it derives from the raw step list (never from the
 * machine's own helpers, so a bug in a helper cannot blind it), and random-walks larger flows.
 * The machine is passed in, so the mutation test runs the same checks on deliberately broken
 * copies.
 */
import type {
  StepperEffect,
  StepperEvent,
  StepperFlow,
  StepperFlowOptions,
  StepperSnapshot,
  StepperState,
  StepperStep,
  StepperTransition,
} from "../src/stepper/core";

interface Machine {
  createFlow: (steps: readonly StepperStep[], options?: StepperFlowOptions) => StepperFlow;
  createInitialState: (flow: StepperFlow, snapshot?: Partial<StepperSnapshot>) => StepperState;
  reduce: (flow: StepperFlow, state: StepperState, event: StepperEvent) => StepperTransition;
}

type Policy = Required<StepperFlowOptions>;

const POLICIES: readonly Policy[] = [
  { leaveInvalid: "block", navigation: "linear" },
  { leaveInvalid: "block", navigation: "free" },
  { leaveInvalid: "allow", navigation: "free" },
];

/** Step lists the exhaustive check switches between, which exercises reconciling a new list. */
const VARIANTS: readonly (readonly StepperStep[])[] = [
  [{ id: "a" }, { id: "b", optional: true }, { id: "c" }],
  [{ id: "a" }, { id: "c" }],
  [{ id: "b", optional: true }, { id: "c" }, { id: "d" }],
  [
    { id: "a" },
    { disabled: true, id: "b", optional: true },
    { id: "c" },
    { id: "d", optional: true },
  ],
  [
    { id: "a" },
    { id: "b", invalidatesDownstream: false, optional: true },
    { id: "c" },
    { id: "r", review: true },
  ],
  [{ id: "a" }, { id: "c" }, { disabled: true, id: "r", review: true }],
];

/** `z` is never a step, which exercises the unknown-id paths. */
const IDS = ["a", "b", "c", "d", "r", "z"];

// The oracle: everything derived from the raw steps, independent of the machine.

type Steps = readonly StepperStep[];

type Marks = Pick<StepperState, "resolution" | "issues">;

const has = <T>(record: Readonly<Record<string, T>>, key: string) => Object.hasOwn(record, key);

const enabledOf = (steps: Steps) => steps.filter((step) => step.disabled !== true);

const reviewOf = (steps: Steps) => {
  const enabled = enabledOf(steps);
  const last = enabled.at(-1);

  return last?.review === true && enabled.length > 1 ? last.id : null;
};

const lastOf = (steps: Steps) => enabledOf(steps).at(-1)?.id;

const at = (steps: Steps, id: string) => enabledOf(steps).findIndex((step) => step.id === id);

const needs = (steps: Steps, step: StepperStep) =>
  step.optional !== true && step.id !== reviewOf(steps);

const unresolvedRequired = (steps: Steps, marks: Marks, step: StepperStep) =>
  needs(steps, step) && !has(marks.resolution, step.id);

const ready = (steps: Steps, marks: Marks, except: string | null) => {
  const others = enabledOf(steps).filter((step) => step.id !== except);

  if (others.some((step) => unresolvedRequired(steps, marks, step))) {
    return "incomplete";
  }

  return others.some((step) => has(marks.issues, step.id)) ? "invalid" : "ok";
};

const frontier = (steps: Steps, marks: Marks) =>
  enabledOf(steps).find((step) => unresolvedRequired(steps, marks, step))?.id ?? lastOf(steps);

const isPending = (state: StepperState) =>
  state.phase.type === "guarding" || state.phase.type === "finishing";

const NAVIGATION = new Set<StepperEvent["type"]>(["NEXT", "PREVIOUS", "GO_TO", "SKIP"]);

const RUN_OUTCOMES = new Set<StepperEvent["type"]>([
  "GUARD_RESOLVED",
  "GUARD_FAILED",
  "FINISH_RESOLVED",
  "FINISH_FAILED",
]);

// Invariants every state holds for its flow

const checkCurrent = (flow: StepperFlow, state: StepperState) =>
  at(flow.steps, state.current) === -1 ? ["I1 current is not an enabled step"] : [];

const checkResolution = (flow: StepperFlow, state: StepperState) =>
  Object.entries(state.resolution).flatMap(([id, value]) => {
    const step = flow.steps.find((candidate) => candidate.id === id);
    const found: string[] = [];

    if (step === undefined) {
      found.push(`I2 resolution for unknown step ${id}`);
    } else if (value === "skipped" && step.optional !== true) {
      found.push(`I2 required step ${id} is skipped`);
    }

    if (id === reviewOf(flow.steps)) {
      found.push("I2 the review step is resolved");
    }

    return found;
  });

const checkIssues = (flow: StepperFlow, state: StepperState) =>
  Object.keys(state.issues).flatMap((id) => {
    const found: string[] = [];

    if (at(flow.steps, id) === -1) {
      found.push(`I3 issues on a step that is not enabled: ${id}`);
    }

    if (has(state.resolution, id)) {
      found.push(`I3 step ${id} is resolved and has issues`);
    }

    if (id === reviewOf(flow.steps)) {
      found.push("I3 the review step has issues");
    }

    return found;
  });

const checkLinear = (flow: StepperFlow, state: StepperState) => {
  if (flow.navigation !== "linear") {
    return [];
  }

  const { steps } = flow;
  const current = at(steps, state.current);

  const behind = enabledOf(steps)
    .filter((step) => at(steps, step.id) < current && unresolvedRequired(steps, state, step))
    .map((step) => `I6 required ${step.id} is unresolved before current ${state.current}`);

  const gap = steps.findIndex(
    (step) => step.disabled !== true && unresolvedRequired(steps, state, step),
  );

  const beyond =
    gap === -1
      ? []
      : steps
          .slice(gap + 1)
          .filter((step) => has(state.resolution, step.id))
          .map((step) => `I7 ${step.id} is resolved after an unresolved required step`);

  return [...behind, ...beyond];
};

const checkReview = (flow: StepperFlow, state: StepperState) =>
  state.current === reviewOf(flow.steps) && ready(flow.steps, state, null) !== "ok"
    ? ["I8 the review step is shown while the flow cannot finish"]
    : [];

const checkGuardTarget = (flow: StepperFlow, state: StepperState, to: string) => {
  const { steps } = flow;
  const from = at(steps, state.current);
  const target = at(steps, to);

  if (target <= from) {
    return ["I4 the guard's target is not ahead"];
  }

  const found: string[] = [];

  const jumped = enabledOf(steps)
    .slice(from + 1, target)
    .some((step) => unresolvedRequired(steps, state, step));

  if (flow.navigation === "linear" && jumped) {
    found.push("I4 the guard would jump an unresolved required step");
  }

  if (to === reviewOf(steps) && ready(steps, state, state.current) !== "ok") {
    found.push("I4 the guard targets a review the flow cannot reach");
  }

  return found;
};

const checkGuarding = (flow: StepperFlow, state: StepperState) => {
  const { phase } = state;

  if (phase.type !== "guarding") {
    return [];
  }

  const found: string[] = [];

  if (phase.from !== state.current) {
    found.push("I4 the guard is not checking the current step");
  }

  if (phase.token !== state.token) {
    found.push("I4 the guard's token is not the state's");
  }

  if (phase.to !== null) {
    return [...found, ...checkGuardTarget(flow, state, phase.to)];
  }

  if (state.current !== lastOf(flow.steps) || state.current === reviewOf(flow.steps)) {
    found.push("I4 a finishing guard on a step that is not the last");
  }

  if (ready(flow.steps, state, state.current) !== "ok") {
    found.push("I4 a finishing guard while other steps are not ready");
  }

  return found;
};

const checkFinish = (flow: StepperFlow, state: StepperState) => {
  const { phase } = state;

  if (phase.type === "finishing") {
    return phase.token === state.token ? [] : ["I4 the finish's token is not the state's"];
  }

  if (phase.type !== "finished") {
    return [];
  }

  const found: string[] = [];

  if (ready(flow.steps, state, null) !== "ok") {
    found.push("I5 finished while a step is unresolved or has issues");
  }

  if (state.current !== lastOf(flow.steps)) {
    found.push("I5 finished on a step that is not the last");
  }

  return found;
};

const INVARIANTS = [
  checkCurrent,
  checkResolution,
  checkIssues,
  checkLinear,
  checkReview,
  checkGuarding,
  checkFinish,
];

const invariants = (flow: StepperFlow, state: StepperState) =>
  INVARIANTS.flatMap((check) => check(flow, state));

// Effect contracts

interface Step {
  flow: StepperFlow;
  before: StepperState;
  event: StepperEvent;
  out: StepperTransition;
}

/** E1: a change is reported exactly when the step moved, except for a controlled sync. */
const checkChanges = ({ before, event, out }: Step) => {
  const after = out.state;
  const changes = out.effects.filter((effect) => effect.type === "change");
  const moved = before.current !== after.current && event.type !== "SYNC";
  const [change] = changes;

  if (changes.length > 1) {
    return ["E1 more than one change"];
  }

  if (moved !== (change !== undefined)) {
    return [
      `E1 ${before.current} -> ${after.current} with ${changes.length} changes (${event.type})`,
    ];
  }

  const mismatch =
    change !== undefined && (change.to !== after.current || change.from !== before.current);

  return mismatch ? ["E1 the change does not match the move"] : [];
};

const tokenOf = (state: StepperState) => ("token" in state.phase ? state.phase.token : null);

/** E2: a guard or finish is requested exactly when its phase is entered. */
const checkRuns = ({ before, event, out }: Step) => {
  const after = out.state;

  const count = (type: StepperEffect["type"]) =>
    out.effects.filter((effect) => effect.type === type).length;

  const entered = (phase: "guarding" | "finishing") =>
    after.phase.type === phase &&
    (before.phase.type !== phase || tokenOf(before) !== tokenOf(after));

  const found: string[] = [];

  if (entered("guarding") !== (count("guard") === 1)) {
    found.push(`E2 guard effect mismatch (${event.type})`);
  }

  if (entered("finishing") !== (count("finish") === 1)) {
    found.push(`E2 finish effect mismatch (${event.type})`);
  }

  if (count("guard") + count("finish") > 1) {
    found.push("E2 more than one run effect");
  }

  return found;
};

/** E3: every action settles exactly once. E4: an accepted result names where the flow landed. */
const checkSettlement = ({ before, event, out }: Step) => {
  const after = out.state;
  const settles = out.effects.filter((effect) => effect.type === "settle");

  const outstanding =
    Number(isPending(before)) + Number(NAVIGATION.has(event.type)) - settles.length;

  const found: string[] = [];

  if (outstanding !== Number(isPending(after))) {
    found.push(
      `E3 ${outstanding} actions outstanding but pending is ${isPending(after)} (${event.type})`,
    );
  }

  const landed = after.phase.type === "finished" ? null : after.current;

  if (
    settles.some(
      (effect) => effect.type === "settle" && effect.result.accepted && effect.result.to !== landed,
    )
  ) {
    found.push("E4 an accepted result does not name where the flow landed");
  }

  return found;
};

// Postconditions of guard and finish outcomes

const isLive = (before: StepperState, event: StepperEvent) => {
  if (!("token" in event)) {
    return false;
  }

  const phase = event.type.startsWith("GUARD") ? "guarding" : "finishing";

  return before.phase.type === phase && tokenOf(before) === event.token;
};

/** P1: an outcome for a move that is no longer running changes nothing. */
const checkStale = ({ before, event, out }: Step) => {
  const ignored = RUN_OUTCOMES.has(event.type) && !isLive(before, event);
  const changed = out.state !== before || out.effects.length > 0;

  return ignored && changed ? [`P1 an ignored outcome changed something (${event.type})`] : [];
};

/** P3 and P4: a guard's verdict lands on the step it checked. */
const checkGuardOutcome = ({ flow, before, event, out }: Step) => {
  if (
    event.type !== "GUARD_RESOLVED" ||
    before.phase.type !== "guarding" ||
    !isLive(before, event)
  ) {
    return [];
  }

  const { from } = before.phase;
  const after = out.state;
  const optional = flow.steps.find((step) => step.id === from)?.optional === true;
  const verdict = event.outcome.status === "skip" && !optional ? "invalid" : event.outcome.status;

  if (verdict === "valid") {
    return after.resolution[from] === "complete"
      ? []
      : ["P3 a valid guard did not complete its step"];
  }

  if (verdict === "skip") {
    return after.resolution[from] === "skipped" ? [] : ["P3 a skip did not mark its step skipped"];
  }

  return has(after.issues, from) && !has(after.resolution, from)
    ? []
    : ["P4 an invalid guard did not leave its step unresolved with issues"];
};

/** P2: a failed finish lands on its earliest failing step, or the linear frontier when earlier. */
const checkFinishFailure = ({ flow, before, event, out }: Step) => {
  if (event.type !== "FINISH_FAILED" || !isLive(before, event)) {
    return [];
  }

  const { steps } = flow;
  const after = out.state;

  const failing = Object.keys(event.issues ?? {})
    .filter((id) => at(steps, id) !== -1 && id !== reviewOf(steps))
    .toSorted((a, b) => at(steps, a) - at(steps, b));

  const [earliest] = failing;

  if (earliest === undefined) {
    return [];
  }

  const edge = frontier(steps, after) ?? earliest;

  const expected =
    flow.navigation === "linear" && at(steps, edge) < at(steps, earliest) ? edge : earliest;

  const found: string[] = [];

  if (after.current !== expected) {
    found.push(`P2 a failed finish landed on ${after.current}, expected ${expected}`);
  }

  if (failing.some((id) => !has(after.issues, id) || has(after.resolution, id))) {
    found.push("P2 a failed finish did not mark its steps invalid");
  }

  return found;
};

const TRANSITION_CHECKS = [
  checkChanges,
  checkRuns,
  checkSettlement,
  checkStale,
  checkGuardOutcome,
  checkFinishFailure,
];

const checkTransition = (step: Step) => [
  ...invariants(step.out.flow, step.out.state),
  ...TRANSITION_CHECKS.flatMap((check) => check(step)),
];

// Exhaustive exploration

const ISSUE_SETS: readonly Record<string, readonly string[]>[] = [
  {},
  { a: ["taken"] },
  { b: ["taken"] },
  { c: ["taken"] },
  { a: ["taken"], c: ["taken"] },
  { z: ["taken"] },
];

const SNAPSHOTS: readonly StepperSnapshot[] = [
  { current: "c", resolution: { a: "complete", b: "skipped" } },
  { current: "r", finished: true, resolution: { a: "complete", b: "complete", c: "complete" } },
];

const outcomesFor = (token: number): StepperEvent[] => [
  { token, outcome: { status: "valid" }, type: "GUARD_RESOLVED" },
  { token, outcome: { status: "skip" }, type: "GUARD_RESOLVED" },
  { token, outcome: { issues: ["bad"], status: "invalid" }, type: "GUARD_RESOLVED" },
  { token, error: new Error("guard"), type: "GUARD_FAILED" },
  { token, type: "FINISH_RESOLVED" },
  ...ISSUE_SETS.map((issues): StepperEvent => ({ issues, token, type: "FINISH_FAILED" })),
];

const eventsFor = (state: StepperState, flows: readonly StepperFlow[], flow: StepperFlow) => [
  ...([{ type: "NEXT" }, { type: "PREVIOUS" }, { type: "SKIP" }, { type: "CANCEL" }] as const),
  { reason: "reset", snapshot: { current: flow.first, resolution: {} }, type: "RESTORE" } as const,
  ...SNAPSHOTS.map((snapshot): StepperEvent => ({ snapshot, reason: "restore", type: "RESTORE" })),
  ...IDS.flatMap((id): StepperEvent[] => [
    { id, type: "GO_TO" },
    { id, type: "INVALIDATE" },
    { id, type: "CLEAR_ISSUES" },
    { id, type: "SYNC" },
  ]),
  ...outcomesFor(state.token),
  ...outcomesFor(state.token - 1),
  ...flows.flatMap((other): StepperEvent[] =>
    other === flow ? [] : [{ flow: other, type: "STEPS" }],
  ),
];

/** Events a cooperative user and passing checks produce, for the liveness check. */
const isHappy = (state: StepperState, event: StepperEvent) => {
  if (NAVIGATION.has(event.type)) {
    return true;
  }

  if (event.type === "GUARD_RESOLVED") {
    return event.token === state.token && event.outcome.status !== "invalid";
  }

  return event.type === "FINISH_RESOLVED" && event.token === state.token;
};

const byKey = (a: string, b: string) => a.localeCompare(b);

const keyOf = (variant: number, state: StepperState) =>
  JSON.stringify([
    variant,
    state.phase.type === "guarding" ? [state.phase.from, state.phase.to] : state.phase.type,
    state.current,
    Object.entries(state.resolution).toSorted(([a], [b]) => byKey(a, b)),
    Object.keys(state.issues).toSorted(byKey),
  ]);

const labelOf = (event: StepperEvent) =>
  [event.type, "id" in event ? event.id : "", "outcome" in event ? event.outcome.status : ""]
    .filter(Boolean)
    .join(":");

interface Node {
  variant: number;
  state: StepperState;
  parent: string | null;
  via: string;
}

interface ExploreReport {
  policy: string;
  states: number;
  transitions: number;
  finished: number;
  deadEnds: number;
  violations: Map<string, string>;
}

const traceOf = (nodes: ReadonlyMap<string, Node>, key: string) => {
  const path: string[] = [];

  for (let node = nodes.get(key); node !== undefined; node = nodes.get(node.parent ?? "")) {
    path.unshift(node.via);
  }

  return path.join(" > ");
};

/** Keys of states from which cooperative events never reach `finished`. */
const deadEnds = (nodes: ReadonlyMap<string, Node>, happy: ReadonlyMap<string, string[]>) => {
  const reverse = new Map<string, string[]>();

  for (const [from, targets] of happy) {
    for (const target of targets) {
      reverse.set(target, [...(reverse.get(target) ?? []), from]);
    }
  }

  const live = new Set(
    [...nodes].flatMap(([key, node]) => (node.state.phase.type === "finished" ? [key] : [])),
  );

  const stack = [...live];

  for (let key = stack.pop(); key !== undefined; key = stack.pop()) {
    const fresh = (reverse.get(key) ?? []).filter((parent) => !live.has(parent));

    for (const parent of fresh) {
      live.add(parent);
    }

    stack.push(...fresh);
  }

  return [...nodes.keys()].filter((key) => !live.has(key));
};

/** Visits every reachable state of the variants under one policy. */
const explore = (machine: Machine, policy: Policy): ExploreReport => {
  const flows = VARIANTS.map((steps) => machine.createFlow(steps, policy));
  const initial = machine.createInitialState(machine.createFlow(VARIANTS[0] ?? [], policy));

  const nodes = new Map<string, Node>([
    [keyOf(0, initial), { parent: null, state: initial, variant: 0, via: "start" }],
  ]);

  const happy = new Map<string, string[]>();
  const violations = new Map<string, string>();
  const queue = [...nodes.keys()];
  let transitions = 0;

  const visit = (key: string, node: Node, flow: StepperFlow, event: StepperEvent) => {
    let out: StepperTransition;

    try {
      out = machine.reduce(flow, node.state, event);
    } catch (error) {
      violations.set(
        `TOTAL the reducer threw on ${event.type}: ${String(error)}`,
        traceOf(nodes, key),
      );

      return null;
    }

    for (const message of checkTransition({ event, flow, out, before: node.state })) {
      if (!violations.has(message)) {
        violations.set(message, `${traceOf(nodes, key)} > ${labelOf(event)}`);
      }
    }

    const variant = event.type === "STEPS" ? flows.indexOf(event.flow) : node.variant;
    const reached = keyOf(variant, out.state);

    if (!nodes.has(reached)) {
      nodes.set(reached, { variant, parent: key, state: out.state, via: labelOf(event) });
      queue.push(reached);
    }

    return reached;
  };

  for (let key = queue.shift(); key !== undefined; key = queue.shift()) {
    const node = nodes.get(key);
    const flow = flows[node?.variant ?? -1];

    if (node === undefined || flow === undefined) {
      continue;
    }

    const cooperative: string[] = [];

    for (const event of eventsFor(node.state, flows, flow)) {
      transitions += 1;
      const reached = visit(key, node, flow, event);

      if (reached !== null && isHappy(node.state, event)) {
        cooperative.push(reached);
      }
    }

    happy.set(key, cooperative);
  }

  const dead = deadEnds(nodes, happy);

  for (const key of dead.slice(0, 3)) {
    violations.set(`L1 cannot reach finished from ${key}`, traceOf(nodes, key));
  }

  return {
    transitions,
    violations,
    deadEnds: dead.length,
    finished: [...nodes.values()].filter((node) => node.state.phase.type === "finished").length,
    policy: `${policy.navigation}/${policy.leaveInvalid}`,
    states: nodes.size,
  };
};

// Random walks

/** Park–Miller, so a failing walk can be replayed from its seed. */
const seeded = (seed: number) => {
  const modulus = 2_147_483_647;
  let value = seed % modulus;

  return () => {
    value = (value * 48_271) % modulus;

    return (value - 1) / (modulus - 1);
  };
};

type Random = () => number;

const pick = <T>(random: Random, list: readonly T[]): T => {
  const item = list[Math.floor(random() * list.length)];

  if (item === undefined) {
    throw new Error("Cannot pick from an empty list.");
  }

  return item;
};

const randomSteps = (random: Random): StepperStep[] => {
  const steps = Array.from({ length: 6 + Math.floor(random() * 5) }, (_, index): StepperStep => ({
    disabled: random() < 0.15,
    id: `s${index}`,
    invalidatesDownstream: random() < 0.2 ? false : undefined,
    optional: random() < 0.3,
  }));

  if (steps.every((step) => step.disabled === true)) {
    steps[0] = { id: "s0" };
  }

  // A review step must be the last enabled one.
  const lastEnabled = steps.findLastIndex((step) => step.disabled !== true);
  const last = steps[lastEnabled];

  if (last !== undefined && random() < 0.3) {
    steps[lastEnabled] = { id: last.id, review: true };
  }

  return steps;
};

/** One random event, biased toward passing checks so deep states are reached. */
const randomEvent = (
  random: Random,
  machine: Machine,
  flow: StepperFlow,
  state: StepperState,
): StepperEvent => {
  const ids = [...flow.steps.map((item) => item.id), "z"];
  const token = random() < 0.8 ? state.token : state.token - 1 - Math.floor(random() * 3);
  const id = pick(random, ids);
  const roll = random();

  const groups: [number, () => readonly StepperEvent[]][] = [
    [
      0.3,
      () => [
        { type: "NEXT" },
        { type: "NEXT" },
        { type: "PREVIOUS" },
        { type: "SKIP" },
        { id, type: "GO_TO" },
      ],
    ],
    [
      0.55,
      () =>
        (["valid", "valid", "valid", "skip", "invalid"] as const).map((status) => ({
          token,
          outcome: { status },
          type: "GUARD_RESOLVED",
        })),
    ],
    [
      0.65,
      () => [
        { token, type: "FINISH_RESOLVED" },
        { token, type: "FINISH_RESOLVED" },
        {
          token,
          issues: { [id]: ["taken"], [pick(random, ids)]: ["taken"] },
          type: "FINISH_FAILED",
        },
        { token, type: "GUARD_FAILED" },
      ],
    ],
    [
      0.8,
      () => [
        { id, type: "INVALIDATE" },
        { id, type: "CLEAR_ISSUES" },
        { id, type: "SYNC" },
      ],
    ],
    [
      0.84,
      () => [
        {
          flow: machine.createFlow(randomSteps(random), {
            leaveInvalid: flow.leaveInvalid,
            navigation: flow.navigation,
          }),
          type: "STEPS",
        },
      ],
    ],
    [
      0.86,
      () => [
        { reason: "reset", snapshot: { current: flow.first, resolution: {} }, type: "RESTORE" },
        { type: "CANCEL" },
      ],
    ],
  ];

  const group = groups.find(([threshold]) => roll < threshold)?.[1];

  return group === undefined ? { type: "NEXT" } : pick(random, group());
};

interface FuzzReport {
  events: number;
  phases: Map<string, number>;
  violations: Map<string, string>;
}

const walk = (machine: Machine, seed: number, length: number, report: FuzzReport) => {
  const random = seeded(seed);
  let flow = machine.createFlow(randomSteps(random), pick(random, POLICIES));
  let state = machine.createInitialState(flow);
  let outstanding = 0;
  const log: string[] = [];

  for (let index = 0; index < length; index += 1) {
    const event = randomEvent(random, machine, flow, state);
    let out: StepperTransition;

    try {
      out = machine.reduce(flow, state, event);
    } catch (error) {
      report.violations.set(
        `TOTAL the reducer threw on ${event.type}: ${String(error)}`,
        `seed ${seed}`,
      );

      return;
    }

    const messages = checkTransition({ event, flow, out, before: state });
    const settles = out.effects.filter((effect) => effect.type === "settle").length;
    outstanding += Number(NAVIGATION.has(event.type)) - settles;

    if (outstanding !== Number(isPending(out.state))) {
      messages.push("E3 an action never settled over a long run");
    }

    for (const message of messages) {
      if (!report.violations.has(message)) {
        report.violations.set(
          message,
          `seed ${seed}, event ${index}: ${[...log.slice(-6), event.type].join(" > ")}`,
        );
      }
    }

    log.push(event.type);
    report.events += 1;
    report.phases.set(out.state.phase.type, (report.phases.get(out.state.phase.type) ?? 0) + 1);
    ({ flow, state } = out);
  }
};

/** Random walks over larger random flows. */
const fuzz = (
  machine: Machine,
  { walks, length }: { walks: number; length: number },
): FuzzReport => {
  const report: FuzzReport = { events: 0, phases: new Map(), violations: new Map() };

  for (let seed = 1; seed <= walks; seed += 1) {
    walk(machine, seed, length, report);
  }

  return report;
};

export { explore, fuzz, POLICIES };

export type { ExploreReport, FuzzReport, Machine };
