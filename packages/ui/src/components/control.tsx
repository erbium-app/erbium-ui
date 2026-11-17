import * as React from "react";
import { Icon } from "./icon";
import { RotatingChevron } from "./stateful-icon";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { mergeProps } from "@base-ui/react/merge-props";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import {
  animate,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { MotionStyle, MotionValue } from "motion/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { TextMorph } from "./text-morph";
import {
  clamp,
  decimalPlaces,
  linearScale,
  keyDirection,
  LARGE_STEP_COUNT,
  moveAlongScale,
  nearestIndex,
  resolveScale,
  roundToStep,
} from "../lib/slider-scale";
import type { SliderScale, SliderScaleOption } from "../lib/slider-scale";
import { cn } from "../lib/utils";
import type { CSSVariables, CSSVariableStyle } from "../lib/utils";

const rowClass =
  "group/control relative flex control-size w-full min-w-0 items-center rounded-lg border surface-control text-control-sm text-foreground transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none has-[:disabled]:opacity-50 has-[[data-disabled]]:opacity-50";

const labelClass = "min-w-0 shrink-0 truncate text-control text-muted-foreground";

const valueClass =
  "ms-auto min-w-0 flex-1 text-end text-field text-foreground outline-none placeholder:text-muted-foreground";

const monoClass = "font-mono tabular-nums";

interface CommonProps {
  label: string;
  disabled?: boolean;
  className?: string;
}

const Group = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="control-group"
    className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
    {...props}
  />
);

const Row = ({
  label,
  className,
  children,
  ...props
}: CommonProps & React.ComponentProps<"div">) => (
  <div data-slot="control-row" className={cn(rowClass, className)} {...props}>
    <span className={labelClass}>{label}</span>
    {children}
  </div>
);

type NumberProps = CommonProps & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Continuous dragging accepts fine values; discrete dragging snaps to step or steps. */
  mode?: "continuous" | "discrete";
  /** Allowed values for a discrete control, including uneven intervals. */
  steps?: readonly number[];
  /** Show position marks for small discrete sets. */
  showSteps?: boolean;
  /**
   * How values spread along the row: `"linear"` (default), `"log"` for ranges that
   * span orders of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`.
   */
  scale?: SliderScaleOption;
  formatValue?: (value: number) => string;
  name?: string;
};

/** Track positions Base UI works in when a non-linear scale remaps the values. */
const TRACK_RESOLUTION = 1000;

/** The axis a number control moves along. `values` holds discrete snap points, if any. */
interface NumberScale {
  lower: number;
  upper: number;
  step: number;
  mode: "continuous" | "discrete";
  values: readonly number[];
}

/** Moves a typed or dragged value onto the scale: a snap point, a step, or anywhere. */
const snapToScale = (value: number, { lower, upper, step, mode, values }: NumberScale) => {
  const clamped = clamp(value, lower, upper);

  if (values.length > 1) {
    return values[nearestIndex(values, clamped)];
  }

  if (mode === "continuous") {
    return clamped;
  }

  const stepped = lower + Math.round((clamped - lower) / step) * step;

  return clamp(Number(stepped.toFixed(decimalPlaces(step))), lower, upper);
};

/** Position marks for small discrete scales; none for continuous or crowded ones. */
const stepMarks = ({ lower, upper, step, mode, values }: NumberScale, showSteps: boolean) => {
  if (!showSteps || mode !== "discrete") {
    return [];
  }

  if (values.length > 1) {
    return values;
  }

  if ((upper - lower) / step > 10) {
    return [];
  }

  const count = Math.ceil((upper - lower) / step);

  return [...Array.from({ length: count }, (_, index) => lower + index * step), upper];
};

const formatScaleValue = (value: number, { step, mode, values }: NumberScale) => {
  if (values.length > 1) {
    return String(value);
  }

  if (mode === "continuous") {
    return String(Number(value.toFixed(4)));
  }

  return value.toFixed(decimalPlaces(step));
};

/**
 * The snap point a key moves to: Home and End jump to either end, arrows and page
 * keys move one point (ten with Shift). Null for keys that do not move the value.
 */
const keyTargetIndex = (
  event: { key: string; shiftKey: boolean },
  rtl: boolean,
  currentIndex: number,
  count: number,
) => {
  if (event.key === "Home") {
    return 0;
  }

  if (event.key === "End") {
    return count - 1;
  }

  const direction = keyDirection(event.key, rtl);

  if (direction === 0) {
    return null;
  }

  return clamp(currentIndex + direction * (event.shiftKey ? LARGE_STEP_COUNT : 1), 0, count - 1);
};

interface KeyMove {
  value: number;
  numberScale: NumberScale;
  trackScale: SliderScale;
  remapped: boolean;
}

/**
 * The value a key moves a continuous or non-linear control to. Home and End jump to
 * either end; arrows move one step (ten with Shift or the page keys). A non-linear
 * track moves by track distance instead, so each press covers the same ground.
 * Null for keys that do not move the value.
 */
const keyTargetValue = (
  event: { key: string; shiftKey: boolean },
  rtl: boolean,
  { value, numberScale, trackScale, remapped }: KeyMove,
) => {
  const { lower, upper, step, mode } = numberScale;

  if (event.key === "Home") {
    return lower;
  }

  if (event.key === "End") {
    return upper;
  }

  const direction = keyDirection(event.key, rtl);

  if (direction === 0) {
    return null;
  }

  const large = event.shiftKey || event.key === "PageUp" || event.key === "PageDown";

  if (!remapped) {
    const moved = value + direction * step * (large ? LARGE_STEP_COUNT : 1);

    return clamp(Number(moved.toFixed(4)), lower, upper);
  }

  return moveAlongScale({
    direction,
    large,
    lower,
    scale: trackScale,
    step: mode === "discrete" ? step : undefined,
    upper,
    value,
  });
};

/**
 * The axis Base UI moves a number control along. A linear row works on the values
 * themselves; a non-linear scale works on track positions, translated back here.
 */
const numberTrack = (scale: NumberScale, option: SliderScaleOption | undefined) => {
  const { lower, upper, step, mode, values } = scale;
  const trackScale = resolveScale(option, lower);
  const remapped = trackScale !== linearScale;
  const hasSteps = values.length > 1;

  const toTrack = (number: number) =>
    remapped ? TRACK_RESOLUTION * clamp(trackScale.toPosition(number, lower, upper), 0, 1) : number;

  // Dragging only snaps to discrete points; free values stay on the slider's own step.
  const toValue = (position: number) => {
    if (!remapped) {
      return hasSteps ? values[nearestIndex(values, position)] : position;
    }

    const raw = trackScale.toValue(position / TRACK_RESOLUTION, lower, upper);

    return mode === "discrete" ? snapToScale(raw, scale) : roundToStep(raw, lower, undefined);
  };

  return {
    max: remapped ? TRACK_RESOLUTION : upper,
    min: remapped ? 0 : lower,
    // Keys move discrete points, continuous values and non-linear tracks here;
    // even discrete steps on a linear row use Base UI's own keyboard handling.
    ownsKeys: hasSteps || remapped || mode === "continuous",
    remapped,
    // Base UI uses a step for pointer and keyboard input. A fine step makes the
    // pointer feel free while preserving native slider semantics. Uneven discrete
    // values stay on the real numeric axis, then snap through onValueChange.
    step: remapped || hasSteps || mode === "continuous" ? 0.0001 : step,
    toTrack,
    toValue,
    trackScale,
  };
};

/** Submits a remapped control's value; Base UI's own input holds its track position. */
const TrackValueInput = ({
  name,
  disabled,
  value,
}: {
  name: string | undefined;
  disabled: boolean | undefined;
  value: number;
}) =>
  name === undefined ? null : <input type="hidden" name={name} disabled={disabled} value={value} />;

/** How far a pointer has travelled past either horizontal edge of `bounds`. */
const overflowPast = (x: number, bounds: DOMRect) => {
  if (x < bounds.left) {
    return x - bounds.left;
  }

  if (x > bounds.right) {
    return x - bounds.right;
  }

  return 0;
};

const ControlNumber = ({
  label,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  mode = "discrete",
  steps,
  showSteps = true,
  scale: scaleOption,
  formatValue,
  disabled,
  className,
  name,
}: NumberProps) => {
  const [localValue, setLocalValue] = React.useState(defaultValue ?? min);
  const current = value ?? localValue;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pointerRef = React.useRef<{ x: number; y: number; bounds: DOMRect } | null>(null);
  const stretchRef = React.useRef(0);
  const springFrameRef = React.useRef<number | null>(null);
  const fillAnimationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const id = React.useId();
  const safeStep = step > 0 ? step : 1;

  const allowedValues = React.useMemo(
    () =>
      mode === "discrete" && steps !== undefined
        ? [...new Set(steps.filter(Number.isFinite))].toSorted((a, b) => a - b)
        : [],
    [mode, steps],
  );

  const hasSteps = allowedValues.length > 1;
  const lower = hasSteps ? allowedValues[0] : min;
  // `.at(-1) ?? …` rather than an index read; the fallback absorbs the
  // optional so the step math below stays non-nullable.
  const stepCandidates = hasSteps ? allowedValues : [];
  const upper = stepCandidates.at(-1) ?? (max > min ? max : min + safeStep);
  const scale: NumberScale = { lower, mode, step: safeStep, upper, values: allowedValues };
  const track = numberTrack(scale, scaleOption);
  const { trackScale, remapped, toTrack, toValue } = track;
  const pct = clamp(trackScale.toPosition(current, lower, upper) * 100, 0, 100);
  const markValues = stepMarks(scale, showSteps);

  const visualPct = useMotionValue(pct);
  const fillWidth = useTransform(visualPct, (percent) => `${percent}%`);

  const handleStart = useTransform(
    visualPct,
    (percent) => `clamp(4px, ${percent}%, calc(100% - 4px))`,
  );

  const fillStyle: MotionStyle & CSSVariables<MotionValue<string>> = {
    "--control-fill-width": fillWidth,
  };

  const handleStyle: MotionStyle & CSSVariables<MotionValue<string>> = {
    "--control-handle-start": handleStart,
  };

  const shown = formatValue?.(current) ?? formatScaleValue(current, scale);

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.select();
    }
  }, [editing]);

  React.useEffect(() => {
    fillAnimationRef.current?.stop();

    if (
      dragging ||
      pointerRef.current ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      visualPct.jump(pct);

      return;
    }

    fillAnimationRef.current = animate(visualPct, pct, {
      damping: 25,
      mass: 0.8,
      stiffness: 300,
      type: "spring",
    });
  }, [pct, dragging, visualPct]);

  React.useEffect(
    () => () => {
      if (springFrameRef.current !== null) {
        cancelAnimationFrame(springFrameRef.current);
      }

      fillAnimationRef.current?.stop();
    },
    [],
  );

  const setSurfaceStretch = (pixels: number) => {
    stretchRef.current = pixels;

    if (!surfaceRef.current) {
      return;
    }

    surfaceRef.current.style.left = `${Math.min(pixels, 0)}px`;
    surfaceRef.current.style.right = `${Math.min(-pixels, 0)}px`;
  };

  const finishStretch = () => {
    if (!pointerRef.current) {
      return;
    }

    pointerRef.current = null;
    setDragging(false);
    const start = stretchRef.current;

    if (start === 0) {
      return;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSurfaceStretch(0);

      return;
    }

    let position = start;
    let velocity = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.032);
      previousTime = time;
      velocity += (-360 * position - 26 * velocity) * delta;
      position += velocity * delta;

      if (Math.abs(position) < 0.02 && Math.abs(velocity) < 0.2) {
        setSurfaceStretch(0);
        springFrameRef.current = null;
      } else {
        setSurfaceStretch(position);
        springFrameRef.current = requestAnimationFrame(tick);
      }
    };

    springFrameRef.current = requestAnimationFrame(tick);
  };

  const change = (next: number) => {
    const actual = toValue(next);

    // A fine track step reports many positions that round to one value.
    if (actual === current) {
      return;
    }

    setLocalValue(actual);
    onValueChange?.(actual);
  };

  const commit = () => {
    if (!editing) {
      return;
    }

    const parsed = Number(draft.trim());

    if (draft.trim() !== "" && Number.isFinite(parsed)) {
      const next = snapToScale(parsed, scale);

      setLocalValue(next);
      onValueChange?.(next);
      onValueCommitted?.(next);
    }

    setEditing(false);
  };

  return (
    <SliderPrimitive.Root
      data-slot="control-number"
      data-elastic-dragging={dragging || undefined}
      aria-labelledby={id}
      className={cn(
        "group/number relative block min-h-control w-full min-w-0 data-disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      min={track.min}
      max={track.max}
      step={track.step}
      // Base UI's input holds a track position when remapped; a hidden input submits the value.
      name={remapped ? undefined : name}
      value={toTrack(current)}
      onValueChange={change}
      onValueCommitted={(next) => onValueCommitted?.(toValue(next))}
      onKeyDownCapture={(event) => {
        if (!track.ownsKeys || disabled === true || editing) {
          return;
        }

        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        let next: number | null = null;

        if (hasSteps) {
          const targetIndex = keyTargetIndex(
            event,
            rtl,
            nearestIndex(allowedValues, current),
            allowedValues.length,
          );

          next = targetIndex === null ? null : allowedValues[targetIndex];
        } else {
          next = keyTargetValue(event, rtl, {
            numberScale: scale,
            remapped,
            trackScale,
            value: current,
          });
        }

        if (next === null) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (next === current) {
          return;
        }

        setLocalValue(next);
        onValueChange?.(next);
        onValueCommitted?.(next);
      }}
    >
      <div
        ref={surfaceRef}
        aria-hidden="true"
        data-slot="control-number-surface"
        className="pointer-events-none absolute inset-0 rounded-lg border surface-control"
      >
        <div className="absolute -inset-px overflow-hidden rounded-[inherit]">
          <motion.div
            className="w-(--control-fill-width) absolute inset-y-0 inset-s-0 bg-foreground/8 transition-colors duration-150 group-hover/number:bg-foreground/12 dark:bg-foreground/12 dark:group-hover/number:bg-foreground/16 motion-reduce:transition-none"
            style={fillStyle}
          />
          {markValues.map((mark) => {
            const markStyle: CSSVariableStyle = {
              "--control-step-start": `clamp(4px, ${trackScale.toPosition(mark, lower, upper) * 100}%, calc(100% - 4px))`,
            };

            return (
              <span
                key={mark}
                data-slot="control-number-step"
                data-active={Math.abs(mark - current) < 0.000001 || undefined}
                className="inset-s-(--control-step-start) absolute top-1/2 size-1.25 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/35 transition-[background-color,transform] duration-150 data-active:scale-125 data-active:bg-foreground/80 rtl:translate-x-1/2 motion-reduce:transition-none"
                style={markStyle}
              />
            );
          })}
        </div>
        <motion.div
          className="inset-s-(--control-handle-start) absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 opacity-0 transition-opacity duration-150 group-hover/number:opacity-70 group-data-elastic-dragging/number:opacity-100 rtl:translate-x-1/2 motion-reduce:transition-none"
          style={handleStyle}
        />
      </div>
      <SliderPrimitive.Control
        className="group/slider-control absolute inset-0 z-10 flex cursor-ew-resize touch-none items-center rounded-lg outline-none select-none"
        onPointerDown={(event) => {
          if (event.button !== 0 || disabled === true || editing) {
            return;
          }

          if (springFrameRef.current !== null) {
            cancelAnimationFrame(springFrameRef.current);
          }

          springFrameRef.current = null;
          pointerRef.current = {
            bounds: event.currentTarget.getBoundingClientRect(),
            x: event.clientX,
            y: event.clientY,
          };
        }}
        onPointerMove={(event) => {
          const pointer = pointerRef.current;

          if (!pointer || Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= 3) {
            return;
          }

          if (!dragging) {
            setDragging(true);
          }

          const overflow = overflowPast(event.clientX, pointer.bounds);
          const distance = Math.max(0, Math.abs(overflow) - 32);
          setSurfaceStretch(
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              ? 0
              : Math.sign(overflow) * 8 * Math.sqrt(Math.min(distance / 200, 1)),
          );
        }}
        onPointerUp={finishStretch}
        onPointerCancel={finishStretch}
        onLostPointerCapture={finishStretch}
      >
        <SliderPrimitive.Track className="relative h-full w-full rounded-lg">
          <SliderPrimitive.Indicator className="pointer-events-none h-full bg-transparent" />
          <SliderPrimitive.Thumb
            aria-label={label}
            aria-valuetext={shown}
            className="absolute top-1/2 size-5 rounded-full outline-none"
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
      <span
        id={id}
        aria-hidden="true"
        className={cn(
          labelClass,
          "pointer-events-none absolute inset-s-2.5 top-1/2 z-20 max-w-[55%] -translate-y-1/2",
        )}
      >
        {label}
      </span>
      {editing ? (
        <InputPrimitive
          ref={inputRef}
          aria-label={`${label} value`}
          className={cn(
            "absolute inset-e-2.5 top-1/2 z-30 w-20 -translate-y-1/2 border-b border-ring bg-surface-control text-end text-field outline-none",
            monoClass,
          )}
          inputMode="decimal"
          value={draft}
          onValueChange={setDraft}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              setEditing(false);
            }
          }}
        />
      ) : null}
      {/* Stays mounted under the editor, so a committed value morphs from the old one. */}
      <ButtonPrimitive
        disabled={disabled}
        aria-label={`Edit ${label} value`}
        className={cn(
          "absolute inset-e-2.5 top-1/2 z-20 -translate-y-1/2 rounded-sm px-0.5 text-control text-muted-foreground hover:text-foreground",
          monoClass,
          editing && "invisible",
        )}
        onClick={() => {
          setDraft(String(current));
          setEditing(true);
        }}
      >
        {/* A drag changes the value every frame, so it tracks the hand; jumps morph. */}
        <TextMorph disabled={dragging}>{shown}</TextMorph>
      </ButtonPrimitive>
      {remapped ? <TrackValueInput name={name} disabled={disabled} value={current} /> : null}
    </SliderPrimitive.Root>
  );
};

type TextProps = CommonProps &
  Omit<
    React.ComponentProps<"input">,
    "type" | "onChange" | "value" | "defaultValue" | "disabled"
  > & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

// `Field.Label` names the control through `htmlFor`. Its overlay covers the row, so a
// click anywhere on the row focuses the control; the control sits above the overlay.
const rowLabelClass = "after:absolute after:inset-0 after:rounded-lg";

const Text = ({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: TextProps) => (
  // Field tracks the control's dirty, touched and invalid state.
  <FieldPrimitive.Root
    data-slot="control-text"
    disabled={disabled}
    className={cn(rowClass, className)}
  >
    <FieldPrimitive.Label className={cn(labelClass, rowLabelClass)}>{label}</FieldPrimitive.Label>
    <InputPrimitive
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn(valueClass, "relative min-h-control-sm bg-transparent")}
      {...props}
    />
  </FieldPrimitive.Root>
);

type TextareaProps = CommonProps &
  Omit<React.ComponentProps<"textarea">, "onChange" | "value" | "defaultValue" | "disabled"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

/**
 * Base UI has no textarea part, so `Field.Control` renders the `<textarea>` (the
 * same pattern as the shared `Textarea`): value, disabled, name and id go to the
 * control so the Field tracks it, the rest merge onto the element.
 */
const Textarea = ({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: TextareaProps) => (
  <FieldPrimitive.Root
    data-slot="control-textarea"
    disabled={disabled}
    className={cn(rowClass, "items-start py-1.5", className)}
  >
    <FieldPrimitive.Label className={cn(labelClass, rowLabelClass, "pt-0.5")}>
      {label}
    </FieldPrimitive.Label>
    <FieldPrimitive.Control
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      id={props.id}
      name={props.name}
      render={(defaultProps: React.ComponentProps<"textarea">) => (
        <textarea
          rows={1}
          className={cn(
            valueClass,
            "relative max-h-40 min-h-5 resize-none field-sizing-content bg-transparent",
          )}
          {...mergeProps(defaultProps, props)}
        />
      )}
    />
  </FieldPrimitive.Root>
);

type BooleanProps = CommonProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  presentation?: "switch" | "segments";
  name?: string;
};

interface Option {
  value: string;
  label: string;
}

const SegmentedTrack = ({
  id,
  options,
  value,
  onValueChange,
  disabled,
  name,
  className,
}: {
  id: string;
  options: readonly Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}) => {
  const layoutId = React.useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <LayoutGroup id={layoutId}>
      <RadioGroupPrimitive
        aria-labelledby={id}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        className={cn(
          "relative isolate ms-auto flex min-w-0 rounded-lg surface-well p-0.75",
          className,
        )}
      >
        {options.map((option) => (
          <RadioPrimitive.Root
            key={option.value}
            value={option.value}
            className="relative flex min-h-control-sm min-w-0 items-center justify-center rounded-md px-2 py-0.5 text-center text-control-sm text-muted-foreground outline-none transition-colors duration-150 data-checked:text-foreground hover:text-foreground motion-reduce:transition-none"
          >
            {value === option.value && (
              <motion.span
                data-slot="control-segment-indicator"
                aria-hidden="true"
                layoutId="selection"
                initial={false}
                transition={
                  shouldReduceMotion === true
                    ? { duration: 0 }
                    : { damping: 35, stiffness: 400, type: "spring" }
                }
                className="pointer-events-none absolute inset-0 z-0 rounded-md border surface-control"
              />
            )}
            <span className="relative z-10 min-w-0 truncate">{option.label}</span>
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>
    </LayoutGroup>
  );
};

const Boolean = ({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  presentation = "segments",
  disabled,
  className,
  name,
}: BooleanProps) => {
  const [local, setLocal] = React.useState(defaultChecked ?? false);
  const current = checked ?? local;
  const id = React.useId();

  const change = (next: boolean) => {
    setLocal(next);
    onCheckedChange?.(next);
  };

  return (
    <div className={cn(rowClass, className)} data-slot="control-boolean">
      <span id={id} className={labelClass}>
        {label}
      </span>
      {presentation === "segments" ? (
        <SegmentedTrack
          id={id}
          options={[
            { label: "Off", value: "off" },
            { label: "On", value: "on" },
          ]}
          value={current ? "on" : "off"}
          onValueChange={(next) => {
            change(next === "on");
          }}
          disabled={disabled}
          name={name}
          className="shrink-0 **:[[role=radio]]:min-w-9"
        />
      ) : (
        <SwitchPrimitive.Root
          aria-labelledby={id}
          checked={current}
          onCheckedChange={change}
          disabled={disabled}
          name={name}
          className="ms-auto inline-flex h-5 w-9 shrink-0 items-center rounded-full surface-well p-0.5 outline-none transition-colors data-checked:bg-selection"
        >
          <SwitchPrimitive.Thumb className="size-4 rounded-full surface-knob transition-transform duration-200 data-checked:translate-x-4 rtl:data-checked:-translate-x-4 motion-reduce:transition-none" />
        </SwitchPrimitive.Root>
      )}
    </div>
  );
};

type ChoiceProps = CommonProps & {
  options: readonly Option[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

const Segmented = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  name,
}: ChoiceProps) => {
  const id = React.useId();
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;

  const change = (next: string) => {
    setLocal(next);
    onValueChange?.(next);
  };

  return (
    <div data-slot="control-segmented" className={cn(rowClass, className)}>
      <span id={id} className={labelClass}>
        {label}
      </span>
      <SegmentedTrack
        id={id}
        options={options}
        value={current}
        onValueChange={change}
        disabled={disabled}
        name={name}
        className="max-w-[65%]"
      />
    </div>
  );
};

/** The shared popup for Select and Image: portal, positioner, and scrollable list. */
const OptionsPopup = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner sideOffset={5} align="end" className="z-50">
      <SelectPrimitive.Popup className={className}>
        <ScrollArea
          className="min-h-0 overscroll-contain"
          fade="vertical"
          scrollbar="thin"
          viewportRole="listbox"
          viewportRender={<SelectPrimitive.List />}
          contentClassName="p-1 in-data-has-overflow-y:pe-3"
        >
          {children}
        </ScrollArea>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
);

const Select = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  name,
}: ChoiceProps) => (
  <SelectPrimitive.Root
    value={value}
    defaultValue={defaultValue}
    onValueChange={(next) => {
      if (next !== null) {
        onValueChange?.(next);
      }
    }}
    disabled={disabled}
    name={name}
    items={options}
  >
    <SelectPrimitive.Trigger
      data-slot="control-select"
      aria-label={label}
      className={cn(rowClass, "group group/control-select justify-between outline-none", className)}
    >
      <span className={labelClass}>{label}</span>
      <span className="ms-auto flex min-w-0 items-center gap-related text-muted-foreground">
        <SelectPrimitive.Value className="truncate text-end text-foreground" />
        <SelectPrimitive.Icon>
          <RotatingChevron className="size-3.5" />
        </SelectPrimitive.Icon>
      </span>
    </SelectPrimitive.Trigger>
    <OptionsPopup className="flex max-h-(--available-height) min-w-(--anchor-width) flex-col origin-(--transform-origin) overflow-hidden rounded-lg surface-overlay text-control outline-none transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
      {options.map((option) => (
        <SelectPrimitive.Item
          key={option.value}
          value={option.value}
          className="flex cursor-default items-center justify-between gap-3 rounded-md px-2.5 py-1.5 outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
        >
          <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
          <SelectPrimitive.ItemIndicator>
            <Icon name="check" className="size-3.5" />
          </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      ))}
    </OptionsPopup>
  </SelectPrimitive.Root>
);

// A full six-digit hex colour, the only form the native colour input accepts.
const hexColor = /^#[\da-f]{6}$/iu;

type ColorProps = CommonProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

const Color = ({
  label,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  name,
}: ColorProps) => {
  const [local, setLocal] = React.useState(defaultValue);
  const [draft, setDraft] = React.useState(value ?? defaultValue);
  const current = value ?? local;
  const [previous, setPrevious] = React.useState(current);

  if (previous !== current) {
    setPrevious(current);
    setDraft(current);
  }

  const valid = hexColor.test(current);
  const swatchStyle: CSSVariableStyle = { "--control-color": valid ? current : "transparent" };

  const change = (next: string) => {
    setLocal(next);
    setDraft(next);
    onValueChange?.(next);
  };

  // The hex input is the Field control (the label targets it); the native color
  // input has no Base UI part, so it carries the form name and always holds a
  // valid hex, which replaces the old hidden input.
  return (
    <FieldPrimitive.Root
      data-slot="control-color"
      disabled={disabled}
      className={cn(rowClass, className)}
    >
      <FieldPrimitive.Label className={labelClass}>{label}</FieldPrimitive.Label>
      <InputPrimitive
        aria-label={`${label} hex value`}
        // Field.Label would name the input "Fill"; keep the hex-specific name.
        aria-labelledby={undefined}
        value={draft}
        onValueChange={(next) => {
          setDraft(next);

          if (hexColor.test(next)) {
            change(next);
          }
        }}
        className={cn(valueClass, monoClass, "w-20 bg-transparent")}
      />
      <span
        className="relative size-5 shrink-0 overflow-hidden rounded-md border surface-knob bg-(--control-color)!"
        style={swatchStyle}
      >
        <input
          aria-label={`Pick ${label}`}
          type="color"
          name={name}
          disabled={disabled}
          value={valid ? current : ""}
          onChange={(event) => {
            change(event.target.value);
          }}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </span>
    </FieldPrimitive.Root>
  );
};

type ImageProps = CommonProps & {
  src?: string;
  options?: readonly (Option & { src: string })[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  accept?: string;
  name?: string;
};

const ImagePreview = ({ src }: { src: string }) => (
  <span className="image-hairline size-6 shrink-0 overflow-hidden rounded-sm">
    <img alt="" src={src} className="size-full object-cover" />
  </span>
);

/**
 * Opens the file picker. Beside an option select it is a bare icon; on its own it
 * shows the current image (or an icon) and says what clicking does.
 */
const ImageUploadButton = ({
  label,
  disabled,
  hasOptions,
  preview,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  hasOptions: boolean;
  preview?: string;
  onClick: () => void;
}) => {
  const showPreview = !hasOptions && preview !== undefined;

  return (
    <ButtonPrimitive
      disabled={disabled}
      aria-label={`Upload ${label}`}
      onClick={onClick}
      data-no-options={hasOptions ? undefined : ""}
      className="flex min-w-0 items-center gap-related rounded-sm text-control text-muted-foreground hover:text-foreground data-no-options:ms-auto"
    >
      {showPreview ? <ImagePreview src={preview} /> : <Icon name="image-plus" className="size-4" />}
      {hasOptions ? null : <span>{preview === undefined ? "Choose image" : "Change"}</span>}
    </ButtonPrimitive>
  );
};

const Image = ({
  label,
  src,
  options,
  value,
  defaultValue,
  onValueChange,
  onFileChange,
  accept = "image/*",
  disabled,
  className,
  name,
}: ImageProps) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue ?? options?.[0]?.value);
  const selected = options?.find((option) => option.value === (value ?? selectedValue));
  const preview = selected?.src ?? src;
  const hasOptions = options !== undefined && options.length > 0;
  const hasPreview = preview !== undefined && preview !== "";
  // Without options the button is the only way to pick an image.
  const canUpload = onFileChange !== undefined || !hasOptions;

  return (
    <div data-slot="control-image" className={cn(rowClass, className)}>
      <span className={labelClass}>{label}</span>
      {hasOptions ? (
        <SelectPrimitive.Root
          items={options}
          value={value ?? selectedValue}
          onValueChange={(next) => {
            if (next !== null) {
              setSelectedValue(next);
              onValueChange?.(next);
            }
          }}
          disabled={disabled}
          name={name}
        >
          <SelectPrimitive.Trigger
            aria-label={label}
            className="group group/control-select ms-auto flex min-w-0 items-center gap-related rounded-sm text-control text-muted-foreground outline-none hover:text-foreground"
          >
            {hasPreview ? <ImagePreview src={preview} /> : null}
            <SelectPrimitive.Value className="max-w-24 truncate" />
            <SelectPrimitive.Icon>
              <RotatingChevron className="size-3.5" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <OptionsPopup className="flex max-h-(--available-height) min-w-(--anchor-width) flex-col overflow-hidden rounded-lg surface-overlay outline-none">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-default items-center gap-related rounded-md px-2 py-1.5 text-control outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                <ImagePreview src={option.src} />
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="ms-auto">
                  <Icon name="check" className="size-3.5" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </OptionsPopup>
        </SelectPrimitive.Root>
      ) : null}
      {canUpload ? (
        <ImageUploadButton
          label={label}
          disabled={disabled}
          hasOptions={hasOptions}
          preview={hasPreview ? preview : undefined}
          onClick={() => ref.current?.click()}
        />
      ) : null}
      <input
        ref={ref}
        type="file"
        name={hasOptions ? undefined : name}
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
      />
    </div>
  );
};

interface PadValue {
  x: number;
  y: number;
}

type PadProps = CommonProps & {
  value?: PadValue;
  defaultValue?: PadValue;
  onValueChange?: (value: PadValue) => void;
  min?: number;
  max?: number;
  step?: number;
};

// Shared so the default prop keeps one identity across renders.
const padOrigin: PadValue = { x: 0, y: 0 };

/** Snaps a 0–1 fraction of the pad to the nearest step between `min` and `max`. */
const snapToStep = (fraction: number, min: number, max: number, step: number) =>
  clamp(min + Math.round(((max - min) * fraction) / step) * step, min, max);

const Pad = ({
  label,
  value,
  defaultValue = padOrigin,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
}: PadProps) => {
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const ref = React.useRef<HTMLDivElement>(null);
  const span = max > min ? max - min : 1;

  const pointStyle: CSSVariableStyle = {
    "--control-point-x": `${((current.x - min) / span) * 100}%`,
    "--control-point-y": `${100 - ((current.y - min) / span) * 100}%`,
  };

  const safeStep = step > 0 ? step : 1;

  const change = (next: PadValue) => {
    setLocal(next);
    onValueChange?.(next);
  };

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    // `span` keeps a one-unit range when min and max coincide.
    const upper = min + span;

    change({
      x: snapToStep((event.clientX - rect.left) / rect.width, min, upper, safeStep),
      y: snapToStep(1 - (event.clientY - rect.top) / rect.height, min, upper, safeStep),
    });
  };

  return (
    <div data-slot="control-pad" className={cn("rounded-lg border surface-control p-3", className)}>
      <div className={cn(labelClass, "mb-2")}>{label}</div>
      <div
        ref={ref}
        aria-hidden="true"
        className="relative h-24 w-full touch-none rounded-md surface-well"
        onPointerDown={(event) => {
          if (disabled === true) {
            return;
          }

          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            fromPointer(event);
          }
        }}
      >
        <span
          className="left-(--control-point-x) top-(--control-point-y) pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border surface-knob bg-selection"
          style={pointStyle}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <ControlNumber
          label="X"
          value={current.x}
          onValueChange={(x) => {
            change({ ...current, x });
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        <ControlNumber
          label="Y"
          value={current.y}
          onValueChange={(y) => {
            change({ ...current, y });
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

type SpringValue =
  | { type: "spring"; visualDuration: number; bounce: number }
  | { type: "spring"; stiffness: number; damping: number; mass: number };

interface EasingValue {
  type: "easing";
  duration: number;
  ease: [number, number, number, number];
}

type TransitionValue = SpringValue | EasingValue;

type SpringProps = CommonProps & {
  value?: SpringValue;
  defaultValue?: SpringValue;
  onValueChange?: (value: SpringValue) => void;
};

type TransitionProps = CommonProps & {
  value?: TransitionValue;
  defaultValue?: TransitionValue;
  onValueChange?: (value: TransitionValue) => void;
};

const defaultTimeSpring: SpringValue = { bounce: 0.2, type: "spring", visualDuration: 0.3 };
const defaultPhysicsSpring: SpringValue = { damping: 25, mass: 1, stiffness: 200, type: "spring" };
const defaultEasing: EasingValue = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], type: "easing" };

const springIsTime = (
  value: SpringValue,
): value is Extract<SpringValue, { visualDuration: number }> => "visualDuration" in value;

const CurveFrame = ({ path }: { path: string }) => (
  <div aria-hidden="true" className="h-24 overflow-hidden rounded-lg border surface-control">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full text-foreground">
      <path
        d="M0 20 H100 M0 80 H100"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </div>
);

const SpringCurve = ({ value }: { value: SpringValue }) => {
  const time = springIsTime(value);
  const stiffness = time ? 200 : value.stiffness;
  const mass = time ? 1 : value.mass;

  const damping = time
    ? 2 * Math.sqrt(stiffness * mass) * (1 - value.bounce * 0.75)
    : value.damping;

  const omega = Math.sqrt(stiffness / mass);
  const ratio = damping / (2 * Math.sqrt(stiffness * mass));
  const duration = time ? Math.max(0.1, value.visualDuration) * 2 : 1.5;

  const points = Array.from({ length: 65 }, (_, index) => {
    const t = (index / 64) * duration;

    const response =
      ratio < 1
        ? 1 -
          Math.exp(-ratio * omega * t) *
            (Math.cos(omega * Math.sqrt(1 - ratio * ratio) * t) +
              (ratio / Math.sqrt(1 - ratio * ratio)) *
                Math.sin(omega * Math.sqrt(1 - ratio * ratio) * t))
        : 1 - (1 + omega * t) * Math.exp(-omega * t);

    return `${index === 0 ? "M" : "L"}${(index / 64) * 100} ${80 - response * 60}`;
  });

  return <CurveFrame path={points.join(" ")} />;
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Section = ({
  title,
  children,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
}: SectionProps) => (
  <Collapsible
    data-slot="control-section"
    defaultOpen={defaultOpen}
    open={open}
    onOpenChange={onOpenChange}
    className={cn("w-full min-w-0", className)}
  >
    <Separator className="mb-2" />
    <CollapsibleTrigger className="group group/section flex w-full items-center justify-between text-start text-control text-muted-foreground outline-none hover:text-foreground">
      {title}
      <RotatingChevron scope="collapsible" className="size-4" />
    </CollapsibleTrigger>
    <CollapsibleContent className="data-open:overflow-visible">
      <Group className="py-2">{children}</Group>
    </CollapsibleContent>
  </Collapsible>
);

/** Duration and bounce for a time spring; stiffness, damping and mass for a physics spring. */
const SpringFields = ({
  value,
  onValueChange,
  disabled,
}: {
  value: SpringValue;
  onValueChange: (value: SpringValue) => void;
  disabled?: boolean;
}) =>
  springIsTime(value) ? (
    <>
      <ControlNumber
        label="Duration"
        value={value.visualDuration}
        onValueChange={(visualDuration) => {
          onValueChange({ ...value, visualDuration });
        }}
        min={0.1}
        max={2}
        step={0.01}
        formatValue={(v) => `${v.toFixed(2)} s`}
        disabled={disabled}
      />
      <ControlNumber
        label="Bounce"
        value={value.bounce}
        onValueChange={(bounce) => {
          onValueChange({ ...value, bounce });
        }}
        min={0}
        max={1}
        step={0.01}
        disabled={disabled}
      />
    </>
  ) : (
    <>
      <ControlNumber
        label="Stiffness"
        value={value.stiffness}
        onValueChange={(stiffness) => {
          onValueChange({ ...value, stiffness });
        }}
        min={1}
        max={1000}
        step={1}
        disabled={disabled}
      />
      <ControlNumber
        label="Damping"
        value={value.damping}
        onValueChange={(damping) => {
          onValueChange({ ...value, damping });
        }}
        min={1}
        max={100}
        step={1}
        disabled={disabled}
      />
      <ControlNumber
        label="Mass"
        value={value.mass}
        onValueChange={(mass) => {
          onValueChange({ ...value, mass });
        }}
        min={0.1}
        max={10}
        step={0.1}
        disabled={disabled}
      />
    </>
  );

const Spring = ({
  label,
  value,
  defaultValue = defaultTimeSpring,
  onValueChange,
  disabled,
  className,
}: SpringProps) => {
  const [local, setLocal] = React.useState<SpringValue>(defaultValue);
  const current = value ?? local;

  const cache = React.useRef<{ physics: SpringValue; time: SpringValue }>({
    physics: defaultPhysicsSpring,
    time: defaultTimeSpring,
  });

  React.useLayoutEffect(() => {
    cache.current[springIsTime(current) ? "time" : "physics"] = current;
  }, [current]);

  const change = (next: SpringValue) => {
    setLocal(next);
    onValueChange?.(next);
  };

  return (
    <Section title={label} className={className}>
      <SpringCurve value={current} />
      <Segmented
        label="Type"
        value={springIsTime(current) ? "time" : "physics"}
        options={[
          { label: "Time", value: "time" },
          { label: "Physics", value: "physics" },
        ]}
        onValueChange={(mode) => {
          change(cache.current[mode === "time" ? "time" : "physics"]);
        }}
        disabled={disabled}
      />
      <SpringFields value={current} onValueChange={change} disabled={disabled} />
    </Section>
  );
};

type TransitionMode = "easing" | "time" | "physics";

const transitionModes: readonly { label: string; value: TransitionMode }[] = [
  { label: "Easing", value: "easing" },
  { label: "Time", value: "time" },
  { label: "Physics", value: "physics" },
];

const transitionModeOf = (value: TransitionValue): TransitionMode => {
  if (value.type === "easing") {
    return "easing";
  }

  return springIsTime(value) ? "time" : "physics";
};

const Transition = ({
  label,
  value,
  defaultValue = defaultEasing,
  onValueChange,
  disabled,
  className,
}: TransitionProps) => {
  const [local, setLocal] = React.useState<TransitionValue>(defaultValue);
  const current = value ?? local;

  const cache = React.useRef<{ easing: EasingValue; time: SpringValue; physics: SpringValue }>({
    easing: defaultEasing,
    physics: defaultPhysicsSpring,
    time: defaultTimeSpring,
  });

  const mode = transitionModeOf(current);

  React.useLayoutEffect(() => {
    if (current.type === "easing") {
      cache.current.easing = current;
    } else if (springIsTime(current)) {
      cache.current.time = current;
    } else {
      cache.current.physics = current;
    }
  }, [current]);

  const change = (next: TransitionValue) => {
    setLocal(next);
    onValueChange?.(next);
  };

  const updateEase = (index: number, next: number) => {
    if (current.type !== "easing") {
      return;
    }

    const ease: EasingValue["ease"] = [...current.ease];
    ease[index] = next;
    change({ ...current, ease });
  };

  return (
    <Section title={label} className={className}>
      {current.type === "easing" ? (
        <CurveFrame
          path={`M0 80 C${current.ease[0] * 100} ${80 - current.ease[1] * 60}, ${current.ease[2] * 100} ${80 - current.ease[3] * 60}, 100 20`}
        />
      ) : (
        <SpringCurve value={current} />
      )}
      <Segmented
        label="Type"
        value={mode}
        options={transitionModes}
        onValueChange={(next) => {
          const option = transitionModes.find((entry) => entry.value === next);

          if (option) {
            change(cache.current[option.value]);
          }
        }}
        disabled={disabled}
      />
      {current.type === "easing" ? (
        <>
          <ControlNumber
            label="Duration"
            value={current.duration}
            onValueChange={(duration) => {
              change({ ...current, duration });
            }}
            min={0.1}
            max={2}
            step={0.01}
            formatValue={(v) => `${v.toFixed(2)} s`}
            disabled={disabled}
          />
          <div className="grid grid-cols-2 gap-1.5">
            {(["X1", "Y1", "X2", "Y2"] as const).map((axis, index) => (
              <ControlNumber
                key={axis}
                label={axis}
                value={current.ease[index]}
                onValueChange={(next) => {
                  updateEase(index, next);
                }}
                min={index % 2 === 0 ? 0 : -1}
                max={index % 2 === 0 ? 1 : 2}
                step={0.01}
                disabled={disabled}
              />
            ))}
          </div>
        </>
      ) : (
        <SpringFields value={current} onValueChange={change} disabled={disabled} />
      )}
    </Section>
  );
};

type ActionProps = CommonProps & Omit<React.ComponentProps<"button">, "children" | "disabled">;

const Action = ({ label, disabled, className, ...props }: ActionProps) => (
  <ButtonPrimitive
    data-slot="control-action"
    disabled={disabled}
    className={cn(rowClass, "justify-center font-medium outline-none", className)}
    {...props}
  >
    {label}
  </ButtonPrimitive>
);

const Control = {
  Action,
  Boolean,
  Color,
  Group,
  Image,
  Number: ControlNumber,
  Pad,
  Row,
  Section,
  Segmented,
  Select,
  Spring,
  Text,
  Textarea,
  Transition,
};

export { Control };

export type {
  NumberProps,
  TextProps,
  TextareaProps,
  BooleanProps,
  ChoiceProps,
  ColorProps,
  ImageProps,
  PadProps,
  SpringProps,
  TransitionProps,
  SpringValue,
  EasingValue,
  TransitionValue,
  SectionProps,
};
