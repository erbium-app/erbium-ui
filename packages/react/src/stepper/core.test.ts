// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import { explore, fuzz, POLICIES } from "../../test/stepper-model";
import {
  createFlow,
  createInitialState,
  getGoToBlock,
  getNextBlock,
  getSkipBlock,
  getStepStatus,
  isStepReached,
  reduce,
} from "./core";
import type { StepperEvent, StepperFlow, StepperState, StepperStep } from "./core";

const machine = { createFlow, createInitialState, reduce };

/** Sends events in order and collects every effect. */
const run = (flow: StepperFlow, events: StepperEvent[], from = createInitialState(flow)) => {
  let state: StepperState = from;
  const effects = [];

  for (const event of events) {
    const out = reduce(flow, state, event);
    ({ state } = out);
    effects.push(...out.effects);
  }

  return { effects, state };
};

const pass = (state: StepperState): StepperEvent => ({
  outcome: { status: "valid" },
  token: state.token,
  type: "GUARD_RESOLVED",
});

const checkout: readonly StepperStep[] = [
  { id: "account" },
  { id: "extras", optional: true },
  { id: "billing" },
  { id: "review", review: true },
];

const editedSteps = (invalidatesDownstream: boolean): StepperStep[] => [
  { id: "a" },
  { id: "b", optional: true, invalidatesDownstream },
  { id: "c" },
  { id: "d" },
];

/** Edits `b` after `a` to `c` were completed, from `d`. */
const reopenFrom = (flow: StepperFlow) =>
  reduce(
    flow,
    createInitialState(flow, {
      current: "d",
      resolution: { a: "complete", b: "complete", c: "complete" },
    }),
    { id: "b", type: "INVALIDATE" },
  ).state;

describe("stepper machine: model check", () => {
  it.each(POLICIES)(
    "holds every invariant in every reachable state ($navigation/$leaveInvalid)",
    (policy) => {
      const report = explore(machine, policy);

      expect(report.states).toBeGreaterThan(400);
      expect(report.finished).toBeGreaterThan(0);
      expect(report.deadEnds).toBe(0);
      expect(Object.fromEntries(report.violations)).toStrictEqual({});
    },
  );

  it("holds every invariant over seeded random walks of larger flows", () => {
    const report = fuzz(machine, { length: 1500, walks: 200 });

    expect(report.phases.get("finished") ?? 0).toBeGreaterThan(0);
    expect(report.phases.get("finishing") ?? 0).toBeGreaterThan(0);
    expect(Object.fromEntries(report.violations)).toStrictEqual({});
  });
});

describe("stepper machine: behaviour", () => {
  it("guards Next, then moves and completes the step", () => {
    const flow = createFlow(checkout);
    const start = createInitialState(flow);
    const guarding = reduce(flow, start, { type: "NEXT" });

    expect(guarding.effects).toStrictEqual([
      { from: "account", to: "extras", token: 1, type: "guard" },
    ]);

    const moved = reduce(flow, guarding.state, pass(guarding.state));

    expect({
      current: moved.state.current,
      effects: moved.effects,
      status: getStepStatus(moved.state, "account"),
    }).toStrictEqual({
      current: "extras",
      effects: [
        { from: "account", reason: "next", to: "extras", type: "change" },
        { result: { accepted: true, from: "account", to: "extras" }, type: "settle" },
      ],
      status: "complete",
    });
  });

  it("rejects a second move while one is checked, and ignores a stale outcome", () => {
    const flow = createFlow(checkout);
    const { state, effects } = run(flow, [{ type: "NEXT" }, { type: "NEXT" }, { type: "CANCEL" }]);

    expect(effects.filter((effect) => effect.type === "settle")).toStrictEqual([
      { result: { accepted: false, reason: "pending" }, type: "settle" },
      { result: { accepted: false, reason: "cancelled" }, type: "settle" },
    ]);

    const late = reduce(flow, state, {
      outcome: { status: "valid" },
      token: 1,
      type: "GUARD_RESOLVED",
    });

    expect({ effects: late.effects, same: late.state === state }).toStrictEqual({
      effects: [],
      same: true,
    });
  });

  it("skips an optional step without its guard and keeps it apart from completed", () => {
    const flow = createFlow(checkout);
    const first = reduce(flow, createInitialState(flow), { type: "NEXT" });
    const { state } = run(flow, [pass(first.state), { type: "SKIP" }], first.state);

    expect({
      account: getStepStatus(state, "account"),
      current: state.current,
      extras: getStepStatus(state, "extras"),
      required: getSkipBlock(flow, state),
    }).toStrictEqual({
      account: "complete",
      current: "billing",
      extras: "skipped",
      required: "required",
    });
  });

  it("keeps the steps the user got to reached after going back to the first", () => {
    const flow = createFlow(checkout);

    const back = createInitialState(flow, {
      current: "account",
      resolution: { account: "complete", extras: "skipped" },
    });

    expect(checkout.map((step) => isStepReached(flow, back, step.id))).toStrictEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("blocks a linear jump over an unresolved required step, but not over an optional one", () => {
    const flow = createFlow(checkout);
    const state = createInitialState(flow);

    // Billing only passes over the optional extras; the guard of the current step decides.
    expect({
      billing: getGoToBlock(flow, state, "billing"),
      extras: getGoToBlock(flow, state, "extras"),
      review: getGoToBlock(flow, state, "review"),
    }).toStrictEqual({ billing: null, extras: null, review: "blocked" });
  });

  it("enters review only when every other step is ready, and finishes from it without a guard", () => {
    const flow = createFlow(checkout, { navigation: "free" });

    const state = createInitialState(flow, {
      current: "billing",
      resolution: { account: "complete", extras: "skipped" },
    });

    expect(getGoToBlock(flow, { ...state, current: "account", resolution: {} }, "review")).toBe(
      "incomplete",
    );

    const guarded = reduce(flow, state, { type: "NEXT" });
    const onReview = reduce(flow, guarded.state, pass(guarded.state));
    const finishing = reduce(flow, onReview.state, { type: "NEXT" });

    expect({
      current: onReview.state.current,
      effects: finishing.effects,
      next: getNextBlock(flow, onReview.state),
    }).toStrictEqual({
      current: "review",
      effects: [{ token: 2, type: "finish" }],
      next: null,
    });
  });

  it("routes a failed finish to the earliest failing step and reopens the steps after it", () => {
    const flow = createFlow(checkout);

    const state: StepperState = {
      ...createInitialState(flow, {
        current: "review",
        resolution: { account: "complete", billing: "complete", extras: "skipped" },
      }),
      phase: { token: 5, type: "finishing" },
      token: 5,
    };

    const out = reduce(flow, state, {
      issues: { account: [{ message: "Email is taken" }], billing: ["Card declined"] },
      token: 5,
      type: "FINISH_FAILED",
    });

    expect({
      current: out.state.current,
      issues: out.state.issues,
      resolution: out.state.resolution,
      result: out.effects.at(-1),
    }).toStrictEqual({
      current: "account",
      issues: { account: [{ message: "Email is taken" }], billing: ["Card declined"] },
      resolution: {},
      result: { result: { accepted: false, reason: "invalid" }, type: "settle" },
    });
  });

  it("reopens later steps when an earlier one is edited, unless an optional step opts out", () => {
    expect({
      kept: reopenFrom(createFlow(editedSteps(false))).resolution,
      reopened: reopenFrom(createFlow(editedSteps(true))).resolution,
    }).toStrictEqual({
      kept: { a: "complete", c: "complete" },
      reopened: { a: "complete" },
    });
  });

  it("moves to the nearest earlier step when the current one is removed", () => {
    const before = createFlow([{ id: "a" }, { id: "b" }, { id: "c" }], { navigation: "free" });
    const after = createFlow([{ id: "a" }, { id: "c" }], { navigation: "free" });

    const out = reduce(before, createInitialState(before, { current: "b" }), {
      flow: after,
      type: "STEPS",
    });

    expect(out.effects).toStrictEqual([{ from: "b", reason: "missing", to: "a", type: "change" }]);
  });

  it("ignores a new step list with the same steps, so a running guard survives", () => {
    const flow = createFlow(checkout);
    const guarding = reduce(flow, createInitialState(flow), { type: "NEXT" });

    const out = reduce(flow, guarding.state, {
      flow: createFlow(checkout.map((step) => ({ ...step }))),
      type: "STEPS",
    });

    expect({ effects: out.effects, same: out.state === guarding.state }).toStrictEqual({
      effects: [],
      same: true,
    });
  });

  it("refuses step lists no flow can run on", () => {
    expect(() => createFlow([{ disabled: true, id: "a" }])).toThrow("at least one enabled step");
    expect(() => createFlow([{ id: "a" }, { id: "a" }])).toThrow("unique");
    expect(() => createFlow([{ id: "a", review: true }, { id: "b" }])).toThrow("last enabled step");
  });
});
