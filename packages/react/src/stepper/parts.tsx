import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { missingContext, visuallyHidden } from "../internal/dom";
import {
  createFlow,
  getGoToBlock,
  getNextBlock,
  getPreviousBlock,
  getSkipBlock,
  getStepResolution,
  getStepStatus,
  isPending,
} from "./core";
import type {
  StepperLeaveInvalid,
  StepperNavigation,
  StepperRejectReason,
  StepperResolution,
  StepperResult,
  StepperSnapshot,
  StepperStep,
  StepperStepId,
  StepperStepStatus,
} from "./core";
import { createStepperStore } from "./store";
import type {
  StepperChangeDetails,
  StepperFinish,
  StepperGuard,
  StepperStore,
  StepperView,
} from "./store";

type StepperOrientation = "horizontal" | "vertical";

/** Words the parts speak to assistive technology. Override them to translate. */
interface StepperLabels {
  complete: string;
  skipped: string;
  invalid: string;
  optional: string;
  /** What the announcer says when the step changes. */
  announce: (info: { position: number; count: number; value: StepperStepId }) => string;
}

const DEFAULT_LABELS: StepperLabels = {
  announce: ({ count, position }) => `Step ${position} of ${count}`,
  complete: "completed",
  invalid: "has errors",
  optional: "optional",
  skipped: "skipped",
};

interface StepperContextValue {
  store: StepperStore;
  orientation: StepperOrientation;
  labels: StepperLabels;
  /** Set once the step has changed, so panels only take focus after a move. */
  moved: React.RefObject<boolean>;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

const useStepperContext = (part: string) =>
  React.use(StepperContext) ?? missingContext(part, "<Stepper.Root>");

/** The root's store, for adapters inside this package. Not part of the public API. */
const useStepperInternals = (part: string): Pick<StepperContextValue, "store"> =>
  useStepperContext(part);

// Store subscriptions

/** Whether two part states hold the same values, so a part skips a re-render. */
const shallowEqual = <T extends Record<string, unknown>>(a: T, b: T) =>
  Object.keys(a).every((key) => Object.is(a[key], b[key]));

/** Subscribes to a slice of the flow. Re-renders only when `isEqual` says the slice changed. */
const useStoreSelector = <T,>(
  store: StepperStore,
  selector: (view: StepperView) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T => {
  const cache = React.useRef<{ view: StepperView; value: T } | null>(null);

  const getSelection = () => {
    const view = store.get();
    const cached = cache.current;

    if (cached?.view === view) {
      return cached.value;
    }

    const value = selector(view);

    if (cached !== null && isEqual(cached.value, value)) {
      cache.current = { value: cached.value, view };

      return cached.value;
    }

    cache.current = { value, view };

    return value;
  };

  return React.useSyncExternalStore(store.subscribe, getSelection, getSelection);
};

/** Reads a slice of the surrounding stepper. */
const useStepperSelector = <T,>(
  selector: (view: StepperView) => T,
  isEqual?: (a: T, b: T) => boolean,
): T => useStoreSelector(useStepperContext("useStepperSelector").store, selector, isEqual);

interface StepperApi {
  next: StepperStore["next"];
  previous: StepperStore["previous"];
  goTo: StepperStore["goTo"];
  skip: StepperStore["skip"];
  invalidate: StepperStore["invalidate"];
  clearIssues: StepperStore["clearIssues"];
  reset: StepperStore["reset"];
  restore: StepperStore["restore"];
  snapshot: StepperStore["snapshot"];
  cancel: StepperStore["cancel"];
  /** The latest flow and state, without subscribing. */
  get: StepperStore["get"];
}

/** The actions of the surrounding stepper. Stable: reading it never re-renders. */
const useStepper = (): StepperApi => {
  const { store } = useStepperContext("useStepper");

  return React.useMemo(
    () => ({
      cancel: store.cancel,
      clearIssues: store.clearIssues,
      get: store.get,
      goTo: store.goTo,
      invalidate: store.invalidate,
      next: store.next,
      previous: store.previous,
      reset: store.reset,
      restore: store.restore,
      skip: store.skip,
      snapshot: store.snapshot,
    }),
    [store],
  );
};

/**
 * Checks `id` before the user leaves it forward or finishes from it. Takes over from the root's
 * `guard` for that step. The latest function always runs, so it may close over render values.
 */
const useStepperGuard = (id: StepperStepId, guard: StepperGuard) => {
  const { store } = useStepperContext("useStepperGuard");
  const latest = React.useRef(guard);

  React.useLayoutEffect(() => {
    latest.current = guard;
  });

  React.useLayoutEffect(
    () => store.registerGuard(id, async (context) => await latest.current(context)),
    [id, store],
  );
};

// Root

interface StepperRootState extends Record<string, unknown> {
  value: StepperStepId;
  orientation: StepperOrientation;
  navigation: StepperNavigation;
  /** A guard or `onFinish` is running. */
  pending: boolean;
  finished: boolean;
}

interface StepperRootProps extends Omit<
  useRender.ComponentProps<"div", StepperRootState>,
  "defaultValue" | "onChange"
> {
  /** The steps, in order. Ids identify steps, so a step keeps its status when others move. */
  steps: readonly StepperStep[];
  /** @default "linear" */
  navigation?: StepperNavigation;
  /** Free navigation only: whether a step whose guard failed can be left. @default "block" */
  leaveInvalid?: StepperLeaveInvalid;
  /** The current step. Controlled. A step the flow cannot reach is refused through `onValueChange`. */
  value?: StepperStepId;
  /** The first step when uncontrolled. Defaults to the first enabled step. */
  defaultValue?: StepperStepId;
  /** Resumes a saved flow on mount, from `snapshot()`. */
  defaultSnapshot?: Partial<StepperSnapshot>;
  /** Called whenever the current step changes, including when the flow moves it on its own. */
  onValueChange?: (value: StepperStepId, details: StepperChangeDetails) => void;
  /** Checks the current step before moving forward or finishing, for steps without their own. */
  guard?: StepperGuard;
  /** Runs after the last step's check passes. Report issues by step to send the user back. */
  onFinish?: StepperFinish;
  /** @default "horizontal" */
  orientation?: StepperOrientation;
  labels?: Partial<StepperLabels>;
}

/** Holds the flow. Renders a `<div>`. */
const StepperRoot = ({
  steps,
  navigation = "linear",
  leaveInvalid = "block",
  value,
  defaultValue,
  defaultSnapshot,
  onValueChange,
  guard,
  onFinish,
  orientation = "horizontal",
  labels: labelsProp,
  render,
  ...props
}: StepperRootProps) => {
  const flow = React.useMemo(
    () => createFlow(steps, { leaveInvalid, navigation }),
    [steps, navigation, leaveInvalid],
  );

  // oxlint-disable-next-line react/hook-use-state -- the store is created once and never replaced; it changes through its own actions.
  const [store] = React.useState(() =>
    createStepperStore(flow, {
      ...defaultSnapshot,
      current: value ?? defaultValue ?? defaultSnapshot?.current ?? flow.first,
    }),
  );

  const moved = React.useRef(false);

  // Latest callbacks first, so a change the new steps cause reaches the current `onValueChange`.
  React.useLayoutEffect(() => {
    store.setCallbacks({
      guard,
      onFinish,
      onValueChange: (next, details) => {
        moved.current = true;
        onValueChange?.(next, details);
      },
    });
  });

  React.useLayoutEffect(() => {
    store.setFlow(flow);
  }, [flow, store]);

  const state = useStoreSelector(
    store,
    (view): StepperRootState => ({
      navigation,
      orientation,
      finished: view.state.phase.type === "finished",
      pending: isPending(view.state),
      value: view.state.current,
    }),
    shallowEqual,
  );

  // A controlled value applies whenever it or the flow's step changes, so a parent that keeps
  // its value refuses a move. A value the flow cannot reach is answered once with the real step.
  const refused = React.useRef<StepperStepId | null>(null);

  React.useLayoutEffect(() => {
    if (value === undefined || value === state.value) {
      refused.current = null;

      return;
    }

    if (store.sync(value)) {
      refused.current = null;
    } else if (refused.current !== value) {
      refused.current = value;
      onValueChange?.(store.get().state.current, { from: value, reason: "unreachable" });
    }
  }, [value, state.value, store, onValueChange]);

  // Unmounting cancels a running move, so its action settles and its signal aborts.
  React.useEffect(
    () => () => {
      store.cancel();
    },
    [store],
  );

  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  const context = React.useMemo<StepperContextValue>(
    () => ({ labels, moved, orientation, store }),
    [labels, orientation, store],
  );

  const element = useRender({
    defaultTagName: "div",
    stateAttributesMapping: { value: () => null },
    props,
    render,
    state,
  });

  return <StepperContext value={context}>{element}</StepperContext>;
};

// List and items

interface StepperListState extends Record<string, unknown> {
  orientation: StepperOrientation;
}

/** The steps as an ordered list. Give it an `aria-label`. */
const StepperList = ({ render, ...props }: useRender.ComponentProps<"ol", StepperListState>) => {
  const { orientation } = useStepperContext("Stepper.List");

  return useRender({ defaultTagName: "ol", state: { orientation }, props, render });
};

interface StepperItemState extends Record<string, unknown> {
  value: StepperStepId;
  /** Position among the enabled steps, from 1. 0 for a disabled step. */
  position: number;
  /** Where the user is: `current` hides whether the step was already completed. */
  status: StepperStepStatus;
  /** What the user has done with the step, even while it is current. Connectors fill from it. */
  resolution: StepperResolution | "pending";
  optional: boolean;
  disabled: boolean;
  invalid: boolean;
  review: boolean;
  /** The trigger can start a move to this step now. */
  reachable: boolean;
  /** The running guard is checking this step. */
  pending: boolean;
  orientation: StepperOrientation;
}

const StepperItemContext = React.createContext<StepperItemState | null>(null);

/** The state of the surrounding `Stepper.Item`. */
const useStepperItem = (): StepperItemState =>
  React.use(StepperItemContext) ?? missingContext("useStepperItem", "<Stepper.Item>");

/** The state of step `id`, as a part shows it. */
const itemStateOf = (
  view: StepperView,
  value: StepperStepId,
  orientation: StepperOrientation,
): StepperItemState => {
  const { flow, state } = view;
  const step = flow.steps.find((candidate) => candidate.id === value);
  const block: StepperRejectReason | null = getGoToBlock(flow, state, value);
  const position = flow.position.get(value);

  return {
    orientation,
    value,
    disabled: step === undefined || step.disabled === true,
    invalid: Object.hasOwn(state.issues, value),
    optional: step?.optional === true,
    pending: state.phase.type === "guarding" && state.phase.from === value,
    position: position === undefined ? 0 : position + 1,
    reachable: block === null || block === "same",
    resolution: getStepResolution(state, value),
    review: flow.review === value,
    status: getStepStatus(state, value),
  };
};

interface StepperItemProps extends useRender.ComponentProps<"li", StepperItemState> {
  /** The step's id. */
  value: StepperStepId;
}

const ITEM_ATTRIBUTES = { orientation: () => null, position: () => null, value: () => null };

/** One step in the list. Its parts read its state. Renders an `<li>`. */
const StepperItem = ({ value, render, ...props }: StepperItemProps) => {
  const { orientation, store } = useStepperContext("Stepper.Item");

  const state = useStoreSelector(
    store,
    (view) => itemStateOf(view, value, orientation),
    shallowEqual,
  );

  const element = useRender({
    defaultTagName: "li",
    stateAttributesMapping: ITEM_ATTRIBUTES,
    props,
    render,
    state,
  });

  return <StepperItemContext value={state}>{element}</StepperItemContext>;
};

const statusText = (item: StepperItemState, labels: StepperLabels) =>
  [
    item.status === "complete" ? labels.complete : null,
    item.status === "skipped" ? labels.skipped : null,
    item.invalid ? labels.invalid : null,
    item.optional ? labels.optional : null,
  ]
    .filter((text) => text !== null)
    .join(", ");

/**
 * Moves to its step. `aria-current="step"` marks the current one. A step it cannot move to is
 * `aria-disabled`, so it stays focusable and in the reading order. Its accessible name ends with
 * the step's status. Renders a `<button>`.
 */
const StepperTrigger = ({
  render,
  children,
  ...props
}: useRender.ComponentProps<"button", StepperItemState>) => {
  const { labels, store } = useStepperContext("Stepper.Trigger");
  const item = useStepperItem();
  const current = item.status === "current";
  const status = statusText(item, labels);
  const inert = !item.reachable || current;

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-current": current ? "step" : undefined,
        "aria-disabled": item.reachable ? undefined : true,
        children: (
          <>
            {children}
            {status === "" ? null : (
              // oxlint-disable-next-line shadcn/no-inline-styles -- a headless package ships no stylesheet, so screen-reader-only text needs its hiding styles inline; the object is a constant.
              <span style={visuallyHidden}>, {status}</span>
            )}
          </>
        ),
        onClick: (event) => {
          if (!event.defaultPrevented && !inert) {
            void store.goTo(item.value);
          }
        },
        type: "button",
      },
      props,
    ),
    state: item,
    stateAttributesMapping: ITEM_ATTRIBUTES,
    render,
  });
};

type StepperIndicatorProps = useRender.ComponentProps<"span", StepperItemState>;

/** The step's mark. Shows its position unless given children. Hidden from assistive technology. */
const StepperIndicator = ({ render, children, ...props }: StepperIndicatorProps) => {
  const item = useStepperItem();

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ "aria-hidden": true, children: children ?? item.position }, props),
    state: item,
    stateAttributesMapping: ITEM_ATTRIBUTES,
    render,
  });
};

type StepperTextProps = useRender.ComponentProps<"span", StepperItemState>;

/** A `<span>` with the item's state, so it is valid inside the trigger's button. */
const useItemSpan = ({ render, ...props }: StepperTextProps) =>
  useRender({
    defaultTagName: "span",
    state: useStepperItem(),
    stateAttributesMapping: ITEM_ATTRIBUTES,
    props,
    render,
  });

/** The step's name. Renders a `<span>`. */
const StepperTitle = (props: StepperTextProps) => useItemSpan(props);

/** A line under the step's name. Renders a `<span>`. */
const StepperDescription = (props: StepperTextProps) => useItemSpan(props);

/** The connector after a step. Style it from `data-resolution`, which a step keeps when the user returns to it. */
const StepperSeparator = ({
  render,
  ...props
}: useRender.ComponentProps<"div", StepperItemState>) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ "aria-hidden": true, role: "presentation" }, props),
    state: useStepperItem(),
    stateAttributesMapping: ITEM_ATTRIBUTES,
    render,
  });

// Panels

interface StepperPanelState extends Record<string, unknown> {
  value: StepperStepId;
  status: StepperStepStatus;
  invalid: boolean;
  /** The panel's step is current. */
  active: boolean;
}

interface StepperPanelProps extends useRender.ComponentProps<"div", StepperPanelState> {
  /** The step this panel belongs to. */
  value: StepperStepId;
  /** Keeps the panel mounted, `hidden` and `inert`, while its step is not current. */
  keepMounted?: boolean;
}

/** Whether focus has nowhere useful to be: on the body, or inside content that is hidden. */
const focusIsLost = () => {
  const active = document.activeElement;

  return (
    active === null ||
    active === document.body ||
    !active.isConnected ||
    active.closest("[hidden], [inert]") !== null
  );
};

/**
 * The content of one step. Only the current step's panel is mounted unless `keepMounted`. After
 * a move, it takes focus when focus would otherwise be lost. Renders a `<div>`.
 */
const StepperPanel = ({ value, keepMounted = false, render, ...props }: StepperPanelProps) => {
  const { moved, store } = useStepperContext("Stepper.Panel");
  const ref = React.useRef<HTMLDivElement>(null);

  const state = useStoreSelector(
    store,
    (view): StepperPanelState => ({
      active: view.state.current === value,
      invalid: Object.hasOwn(view.state.issues, value),
      status: getStepStatus(view.state, value),
      value,
    }),
    (a, b) => a.active === b.active && a.invalid === b.invalid && a.status === b.status,
  );

  React.useLayoutEffect(() => {
    if (state.active && moved.current && focusIsLost()) {
      ref.current?.focus();
    }
  }, [state.active, moved]);

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ hidden: !state.active, inert: !state.active, tabIndex: -1 }, props),
    stateAttributesMapping: { value: () => null },
    ref,
    render,
    state,
  });

  return state.active || keepMounted ? element : null;
};

// Navigation controls

interface StepperControlState extends Record<string, unknown> {
  /** The control cannot act now. */
  disabled: boolean;
  /** A guard or `onFinish` is running. */
  pending: boolean;
  /** Why the control cannot act, or `null`. */
  blocked: StepperRejectReason | null;
}

interface StepperNextState extends StepperControlState {
  /** Next finishes the flow from here. */
  finishes: boolean;
  /** The current step is the review. */
  review: boolean;
}

const CONTROL_ATTRIBUTES = {
  // oxlint-disable-next-line anti-slop/no-unknown-parameters, anti-slop/no-runtime-typeof -- Base UI types a mapper's input as `unknown` for states with an index signature; it is this part's own `blocked`, a reason string or null.
  blocked: (blocked: unknown) => (typeof blocked === "string" ? { "data-blocked": blocked } : null),
};

/** A control that stays focusable while it cannot act, so a click that disables it keeps focus. */
const controlProps = (
  state: StepperControlState,
  act: () => Promise<StepperResult>,
  type: React.ComponentProps<"button">["type"],
): React.ComponentProps<"button"> => ({
  "aria-busy": state.pending ? true : undefined,
  "aria-disabled": state.disabled ? true : undefined,
  onClick: (event) => {
    // A submit button lets its form submit, so Enter and the button share one path.
    if (!event.defaultPrevented && !state.disabled && type !== "submit") {
      act().catch(() => {
        // Actions resolve with a result and never reject.
      });
    }
  },
  type: type ?? "button",
});

const controlStateOf = (view: StepperView, blocked: StepperRejectReason | null) => ({
  blocked,
  disabled: blocked !== null,
  pending: isPending(view.state),
});

/** Moves to the previous step without checking. Renders a `<button>`. */
const StepperPrevious = ({
  render,
  type,
  ...props
}: useRender.ComponentProps<"button", StepperControlState>) => {
  const { store } = useStepperContext("Stepper.Previous");

  const state = useStoreSelector(
    store,
    (view) => controlStateOf(view, getPreviousBlock(view.flow, view.state)),
    shallowEqual,
  );

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(controlProps(state, store.previous, type), props),
    stateAttributesMapping: CONTROL_ATTRIBUTES,
    render,
    state,
  });
};

/**
 * Checks the current step, then moves to the next one. On the last step it finishes the flow.
 * With `type="submit"` it submits its form instead, whose submit handler calls `next()`.
 * Renders a `<button>`.
 */
const StepperNext = ({
  render,
  type,
  ...props
}: useRender.ComponentProps<"button", StepperNextState>) => {
  const { store } = useStepperContext("Stepper.Next");

  const state = useStoreSelector(
    store,
    (view): StepperNextState => ({
      ...controlStateOf(view, getNextBlock(view.flow, view.state)),
      finishes: view.state.current === view.flow.last,
      review: view.state.current === view.flow.review,
    }),
    shallowEqual,
  );

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(controlProps(state, store.next, type), props),
    stateAttributesMapping: CONTROL_ATTRIBUTES,
    render,
    state,
  });
};

/** Skips an optional step without checking it. Renders nothing on a required step. */
const StepperSkip = ({
  render,
  type,
  ...props
}: useRender.ComponentProps<"button", StepperControlState>) => {
  const { store } = useStepperContext("Stepper.Skip");

  const state = useStoreSelector(
    store,
    (view) => controlStateOf(view, getSkipBlock(view.flow, view.state)),
    shallowEqual,
  );

  const element = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(controlProps(state, store.skip, type), props),
    stateAttributesMapping: CONTROL_ATTRIBUTES,
    render,
    state,
  });

  return state.blocked === "required" ? null : element;
};

type StepperAnnouncerProps = useRender.ComponentProps<"div">;

/**
 * A polite live region that names the new step after each move, for when focus stays on the
 * control that moved. Visually hidden unless styled.
 */
const StepperAnnouncer = ({ render, ...props }: StepperAnnouncerProps) => {
  const { labels, store } = useStepperContext("Stepper.Announcer");
  const value = useStoreSelector(store, (view) => view.state.current);
  const [message, setMessage] = React.useState("");
  const previous = React.useRef(value);

  React.useEffect(() => {
    if (previous.current === value) {
      return;
    }

    previous.current = value;
    const { flow } = store.get();

    setMessage(
      labels.announce({
        value,
        count: flow.enabled.length,
        position: (flow.position.get(value) ?? 0) + 1,
      }),
    );
  }, [labels, store, value]);

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-atomic": true,
        "aria-live": "polite",
        children: message,
        role: "status",
        style: visuallyHidden,
      },
      props,
    ),
    render,
  });
};

export {
  StepperAnnouncer,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPanel,
  StepperPrevious,
  StepperRoot,
  StepperSeparator,
  StepperSkip,
  StepperTitle,
  StepperTrigger,
  useStepper,
  useStepperGuard,
  useStepperInternals,
  useStepperItem,
  useStepperSelector,
};

export type {
  StepperAnnouncerProps,
  StepperApi,
  StepperControlState,
  StepperIndicatorProps,
  StepperItemProps,
  StepperItemState,
  StepperLabels,
  StepperListState,
  StepperNextState,
  StepperOrientation,
  StepperPanelProps,
  StepperPanelState,
  StepperRootProps,
  StepperRootState,
};
