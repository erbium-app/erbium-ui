import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { isMotionValue } from "motion/react";
import type { MotionValue } from "motion/react";
import { useAutoplayProgress } from "../hooks/use-autoplay-progress";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";

type StepIndicatorOrientation = "horizontal" | "vertical";

type StepIndicatorStatus = "complete" | "current" | "upcoming";

type StepIndicatorVariant = "steps" | "dots";

// An interface has no implicit index signature, so this alias must stay a
// `type` to remain assignable to Base UI's `Record<string, unknown>` bounds.
// oxlint-disable-next-line typescript/consistent-type-definitions
type StepIndicatorState = {
  value: number;
  variant: StepIndicatorVariant;
  count: number | undefined;
  orientation: StepIndicatorOrientation;
  interactive: boolean;
};

type StepIndicatorContextValue = StepIndicatorState & {
  reach: number;
  select: (index: number) => void;
};

const StepIndicatorContext = createContext<StepIndicatorContextValue | null>(null);

/** Base UI's prop types do not admit data-* keys in object literals. */
const dataAttributes = (attributes: Record<string, string | undefined>) => attributes;

const useStepIndicator = () => {
  const context = use(StepIndicatorContext);

  if (!context) {
    throw new Error("StepIndicatorItem must be inside StepIndicator.");
  }

  return context;
};

// Same index-signature constraint as StepIndicatorState above.
// oxlint-disable-next-line typescript/consistent-type-definitions
type StepIndicatorItemState = {
  index: number;
  status: StepIndicatorStatus;
  invalid: boolean;
  disabled: boolean;
};

type StepIndicatorItemProps = Omit<ComponentProps<"button">, "children"> & {
  /** Zero-based position of this step. */
  index: number;
  /** Overrides the status derived from the indicator's value. */
  status?: StepIndicatorStatus;
  /** Marks the step as having errors. */
  invalid?: boolean;
  /** Accessible name. Defaults to "Step N". Status is appended. */
  label?: string;
  render?: useRender.RenderProp<StepIndicatorItemState>;
};

const derivedStatus = (
  index: number,
  value: number,
  variant: StepIndicatorVariant,
): StepIndicatorStatus => {
  if (index < value && variant === "steps") {
    return "complete";
  }

  return index === value ? "current" : "upcoming";
};

const StepIndicatorDot = ({ orientation }: { orientation: StepIndicatorOrientation }) => {
  const horizontal = orientation === "horizontal";

  return (
    <span
      aria-hidden="true"
      data-slot="step-indicator-dot"
      className={cn(
        "relative block overflow-hidden rounded-full bg-foreground/15",
        "duration-200 ease-out motion-reduce:transition-none",
        horizontal
          ? "h-1.5 w-1.5 transition-all group-data-[status=current]/step:w-6"
          : "h-1.5 w-1.5 transition-all group-data-[status=current]/step:h-6",
        "group-data-[status=complete]/step:bg-foreground/50",
        "group-data-invalid/step:bg-error/30 group-data-invalid/step:group-data-[status=complete]/step:bg-error",
      )}
    >
      <span
        data-slot="step-indicator-fill"
        className={cn(
          "absolute inset-0 rounded-full bg-foreground/70 opacity-0",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          // A live progress source moves every frame; easing it would trail behind.
          "[[data-progress=live]_&]:transition-opacity",
          "group-data-[status=current]/step:opacity-100",
          "group-data-invalid/step:bg-error",
          // Slid, never scaled, so the rounded end keeps its shape. At 0 a full dot
          // shows; at 1 the fill covers the pill.
          horizontal
            ? "translate-x-[calc(var(--step-direction)*(var(--step-progress)-1)*(100%-0.375rem))]"
            : "translate-y-[calc((var(--step-progress)-1)*(100%-0.375rem))]",
        )}
      />
    </span>
  );
};

const StepIndicatorItem = ({
  index,
  status: statusProp,
  invalid = false,
  disabled: disabledProp = false,
  label,
  render,
  className,
  onClick,
  ...props
}: StepIndicatorItemProps) => {
  const { value, variant, interactive, orientation, reach, select } = useStepIndicator();
  // Blocked by `reach` or by the item's own `disabled`. The current step stays selectable.
  const disabled = disabledProp || (index > reach && index !== value);
  const status = statusProp ?? derivedStatus(index, value, variant);
  const state: StepIndicatorItemState = { disabled, index, invalid, status };

  const name = [
    label ?? `Step ${index + 1}`,
    status === "complete" ? "completed" : null,
    invalid ? "has errors" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const controlProps: ComponentProps<"button"> = {
    "aria-current": status === "current" ? "step" : undefined,
    "aria-label": name,
    ...dataAttributes({
      "data-disabled": disabled ? "" : undefined,
      "data-invalid": invalid ? "" : undefined,
      "data-slot": "step-indicator-control",
      "data-status": status,
    }),
    children: <StepIndicatorDot orientation={orientation} />,
    className: cn(
      "group/step relative flex items-center justify-center rounded-full p-1.5 outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring",
      interactive
        ? "cursor-pointer hover:bg-foreground/10 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent"
        : "cursor-default",
      className,
    ),
  };

  // Read-only indicators render a span, which takes no button props.
  if (interactive) {
    controlProps.disabled = disabled;
    controlProps.type = "button";
    controlProps.onClick = (event) => {
      if (!event.defaultPrevented) {
        select(index);
      }
    };
  }

  const control = useRender({
    defaultTagName: interactive ? "button" : "span",
    props: mergeProps<"button">(controlProps, { ...props, onClick }),
    render,
    state,
  });

  return (
    <li data-slot="step-indicator-item" data-orientation={orientation} className="flex">
      {control}
    </li>
  );
};

interface StepIndicatorAutoplay {
  /** Time on each step, in milliseconds. Defaults to 3000. */
  duration?: number;
  /** Holds the fill where it is, for example while the pointer is over the slide. */
  paused?: boolean;
  /** After the last step, go back to the first. Defaults to true. */
  loop?: boolean;
}

type StepIndicatorProps = Omit<ComponentProps<"ol">, "defaultValue"> & {
  /** Zero-based index of the current step. Controlled. */
  value?: number;
  /** Zero-based index of the current step when uncontrolled. Defaults to 0. */
  defaultValue?: number;
  /** Makes every step selectable. Without it the indicator is read-only. */
  onValueChange?: (index: number) => void;
  /** Shorthand for rendering `count` default items when there are no children. */
  count?: number;
  /** Furthest step index that can be selected. Later steps are blocked. Defaults to no limit. */
  reach?: number;
  /**
   * Fills the current step from 0 to 1. Defaults to 1 (solid). A motion value moves the fill
   * every frame without re-rendering, for when something else owns the clock.
   * Takes precedence over `autoplay`.
   */
  progress?: number | MotionValue<number>;
  /**
   * Fills the current step over `duration`, then selects the next of `count` steps. `true`
   * uses the defaults. Pass `count` alongside item children. Reduced motion turns the timer off.
   */
  autoplay?: boolean | StepIndicatorAutoplay;
  orientation?: StepIndicatorOrientation;
  /**
   * `steps` is a sequence: earlier steps read as complete. `dots` is a set of
   * peers (carousel slides, tabs): only the current one is marked.
   */
  variant?: StepIndicatorVariant;
  render?: useRender.RenderProp<StepIndicatorState>;
};

const clampProgress = (progress: number) => Math.min(Math.max(progress, 0), 1);

// motion's own guard narrows to whichever MotionValue class its copy declares.
const isProgressSource = (
  progress: StepIndicatorProps["progress"],
): progress is MotionValue<number> => isMotionValue(progress);

const autoplaySettings = (autoplay: StepIndicatorProps["autoplay"]) => {
  if (autoplay === true) {
    return {};
  }

  if (autoplay === false || autoplay === undefined) {
    return null;
  }

  return autoplay;
};

interface StepIndicatorProgressOptions {
  autoplay: StepIndicatorProps["autoplay"];
  count: number;
  onAdvance: (index: number) => void;
  progress: StepIndicatorProps["progress"];
  style: StepIndicatorProps["style"];
  value: number;
}

/** Resolves the fill source and writes a live one straight to the element, so playback never re-renders. */
const useStepIndicatorProgress = ({
  autoplay,
  count,
  onAdvance,
  progress,
  style,
  value,
}: StepIndicatorProgressOptions) => {
  const settings = autoplaySettings(autoplay);
  const followed = isProgressSource(progress) ? progress : null;
  const fixed = isProgressSource(progress) ? undefined : progress;

  const usesClock = settings !== null && progress === undefined;

  const clock = useAutoplayProgress({
    count,
    onAdvance,
    value,
    duration: settings?.duration ?? 3000,
    held: settings?.paused,
    loop: settings?.loop,
    playing: usesClock,
  });

  const source: MotionValue<number> | null = followed ?? (usesClock ? clock : null);
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!source || !root) {
      return () => {
        // Nothing to follow.
      };
    }

    const write = (next: number) => {
      root.style.setProperty("--step-progress", String(clampProgress(next)));
    };

    write(source.get());
    const unsubscribe = source.on("change", write);

    return () => {
      unsubscribe();
    };
  }, [source]);

  const progressStyle: CSSVariableStyle = {
    "--step-progress": clampProgress(fixed ?? source?.get() ?? 1),
    ...style,
  };

  return { live: source !== null, progressStyle, rootRef };
};

const StepIndicator = ({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  count,
  progress,
  autoplay,
  reach = Number.POSITIVE_INFINITY,
  orientation = "horizontal",
  variant = "steps",
  render,
  children,
  className,
  style,
  ref,
  ...props
}: StepIndicatorProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const interactive = onValueChange !== undefined;

  const select = useCallback(
    (index: number) => {
      if (valueProp === undefined) {
        setUncontrolled(index);
      }

      onValueChange?.(index);
    },
    [valueProp, onValueChange],
  );

  const state: StepIndicatorState = { count, interactive, orientation, value, variant };
  const stepCount = count ?? 0;

  const { live, progressStyle, rootRef } = useStepIndicatorProgress({
    count: stepCount,
    onAdvance: select,
    autoplay,
    progress,
    style,
    value,
  });

  const element = useRender({
    defaultTagName: "ol",
    props: mergeProps<"ol">(
      {
        "aria-label": "Progress",
        ...dataAttributes({
          "data-orientation": orientation,
          "data-progress": live ? "live" : undefined,
          "data-slot": "step-indicator",
        }),
        children:
          children ??
          Array.from({ length: stepCount }, (_, index) => (
            <StepIndicatorItem key={index} index={index} />
          )),
        className: cn(
          "m-0 flex w-fit list-none p-0 [--step-direction:1] rtl:[--step-direction:-1]",
          orientation === "horizontal" ? "flex-row items-center" : "flex-col items-center",
          className,
        ),
        style: progressStyle,
      },
      props,
    ),
    ref: ref ? [rootRef, ref] : rootRef,
    render,
    state,
  });

  const context = useMemo(
    () => ({ count, interactive, orientation, reach, select, value, variant }),
    [count, interactive, orientation, reach, select, value, variant],
  );

  return <StepIndicatorContext value={context}>{element}</StepIndicatorContext>;
};

export { StepIndicator, StepIndicatorItem };

export type {
  StepIndicatorAutoplay,
  StepIndicatorItemProps,
  StepIndicatorItemState,
  StepIndicatorOrientation,
  StepIndicatorProps,
  StepIndicatorState,
  StepIndicatorStatus,
  StepIndicatorVariant,
};
