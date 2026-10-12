import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { createContext, use, useCallback, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../lib/utils";

type StepIndicatorOrientation = "horizontal" | "vertical";
type StepIndicatorStatus = "complete" | "current" | "upcoming";

type StepIndicatorVariant = "steps" | "dots";

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

function useStepIndicator() {
  const context = use(StepIndicatorContext);
  if (!context) throw new Error("StepIndicatorItem must be inside StepIndicator.");
  return context;
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
  /** Fills the current step from 0 to 1. Defaults to 1 (solid). */
  progress?: number;
  orientation?: StepIndicatorOrientation;
  /**
   * `steps` is a sequence: earlier steps read as complete. `dots` is a set of
   * peers (carousel slides, tabs): only the current one is marked.
   */
  variant?: StepIndicatorVariant;
  render?: useRender.RenderProp<StepIndicatorState>;
};

function StepIndicator({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  count,
  progress = 1,
  reach = Number.POSITIVE_INFINITY,
  orientation = "horizontal",
  variant = "steps",
  render,
  children,
  className,
  style,
  ...props
}: StepIndicatorProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const interactive = onValueChange != null;
  const select = useCallback(
    (index: number) => {
      if (valueProp === undefined) setUncontrolled(index);
      onValueChange?.(index);
    },
    [valueProp, onValueChange],
  );
  const state: StepIndicatorState = { value, variant, count, orientation, interactive };
  const element = useRender({
    defaultTagName: "ol",
    render,
    state,
    props: mergeProps<"ol">(
      {
        "aria-label": "Progress",
        ...dataAttributes({ "data-slot": "step-indicator", "data-orientation": orientation }),
        className: cn(
          "m-0 flex w-fit list-none p-0 [--step-direction:1] rtl:[--step-direction:-1]",
          orientation === "horizontal" ? "flex-row items-center" : "flex-col items-center",
          className,
        ),
        style: {
          "--step-progress": Math.min(Math.max(progress, 0), 1),
          ...style,
        } as CSSProperties,
        children:
          children ??
          Array.from({ length: count ?? 0 }, (_, index) => (
            <StepIndicatorItem key={index} index={index} />
          )),
      },
      props,
    ),
  });
  return <StepIndicatorContext value={{ ...state, reach, select }}>{element}</StepIndicatorContext>;
}

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

function derivedStatus(
  index: number,
  value: number,
  variant: StepIndicatorVariant,
): StepIndicatorStatus {
  if (index < value && variant === "steps") return "complete";
  return index === value ? "current" : "upcoming";
}

function StepIndicatorItem({
  index,
  status: statusProp,
  invalid = false,
  disabled: disabledProp = false,
  label,
  render,
  className,
  onClick,
  ...props
}: StepIndicatorItemProps) {
  const { value, variant, interactive, orientation, reach, select } = useStepIndicator();
  // Blocked by `reach` or by the item's own `disabled`. The current step stays selectable.
  const disabled = disabledProp || (index > reach && index !== value);
  const status = statusProp ?? derivedStatus(index, value, variant);
  const state: StepIndicatorItemState = { index, status, invalid, disabled };
  const name = [
    label ?? `Step ${index + 1}`,
    status === "complete" ? "completed" : null,
    invalid ? "has errors" : null,
  ]
    .filter(Boolean)
    .join(", ");
  const control = useRender({
    defaultTagName: interactive ? "button" : "span",
    render,
    state,
    props: mergeProps<"button">(
      {
        "aria-label": name,
        "aria-current": status === "current" ? "step" : undefined,
        ...dataAttributes({
          "data-slot": "step-indicator-control",
          "data-status": status,
          "data-invalid": invalid ? "" : undefined,
          "data-disabled": disabled ? "" : undefined,
        }),
        ...(interactive
          ? {
              type: "button" as const,
              disabled,
              onClick(event) {
                if (!event.defaultPrevented) select(index);
              },
            }
          : {}),
        className: cn(
          "group/step relative flex items-center justify-center rounded-full p-1.5 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring",
          interactive
            ? "cursor-pointer hover:bg-foreground/10 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent"
            : "cursor-default",
          className,
        ),
        children: <StepIndicatorDot orientation={orientation} />,
      },
      { ...props, onClick },
    ),
  });
  return (
    <li data-slot="step-indicator-item" data-orientation={orientation} className="flex">
      {control}
    </li>
  );
}

function StepIndicatorDot({ orientation }: { orientation: StepIndicatorOrientation }) {
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
}

export { StepIndicator, StepIndicatorItem };
export type {
  StepIndicatorItemProps,
  StepIndicatorItemState,
  StepIndicatorOrientation,
  StepIndicatorProps,
  StepIndicatorState,
  StepIndicatorStatus,
  StepIndicatorVariant,
};
