import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { skeletonBlock, skeletonIgnore } from "../lib/skeleton-hints";
import {
  clamp,
  isLinear,
  LARGE_STEP_COUNT,
  logScale,
  moveAlongScale,
  nearestIndex,
  normalizeSteps,
  resolveScale,
  roundToStep,
} from "../lib/slider-scale";
import type { SliderScale, SliderScaleOption } from "../lib/slider-scale";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";

/** A tick on the track. A mark with a `label` also shows it beside the track. */
interface SliderMark {
  value: number;
  label?: React.ReactNode;
}

type SliderValue = number | readonly number[];

/** The value callbacks receive for a `value` of type `Value`: a number stays a number. */
type ReportedValue<Value> = Value extends number ? number : Value;

type SliderProps<Value extends SliderValue = SliderValue> = SliderPrimitive.Root.Props<Value> & {
  /**
   * Allowed values, including uneven intervals. Thumbs snap to the nearest one and
   * arrow keys move one allowed value at a time. Replaces `min`, `max` and `step`.
   */
  steps?: readonly number[];
  /**
   * How values spread along the track: `"linear"` (default), `"log"` for ranges that
   * span orders of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`.
   */
  scale?: SliderScaleOption;
  /**
   * Tick marks along the track. `true` marks each allowed value (`steps`, a short
   * `step` grid, or each power of ten on a log scale). An array places marks; marks
   * with a `label` show it beside the track.
   */
  marks?: boolean | readonly SliderMark[];
};

/** Track positions Base UI works in when a scale or uneven steps remap the values. */
const TRACK_RESOLUTION = 1000;

/** Half of `size-thumb`: with edge alignment, a thumb's centre stays this far inside each end. */
const THUMB_INSET = "0.375rem";

const sameValues = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/** Each power of ten inside the range, plus both ends. */
const decadeMarks = (lower: number, upper: number) => {
  const marks = new Set([lower, upper]);

  for (let decade = 10 ** Math.ceil(Math.log10(lower)); decade < upper; decade *= 10) {
    marks.add(decade);
  }

  return [...marks].toSorted((a, b) => a - b);
};

interface MarkInput {
  marks: SliderProps["marks"];
  steps: readonly number[];
  scale: SliderScale;
  lower: number;
  upper: number;
  step: number;
}

/** Marks as `{ value, label }`, or none. `true` derives them from the scale. */
const resolveMarks = ({ marks, steps, scale, lower, upper, step }: MarkInput) => {
  if (marks === undefined || marks === false) {
    return [];
  }

  if (marks !== true) {
    return marks.filter((mark) => mark.value >= lower && mark.value <= upper);
  }

  if (steps.length > 1) {
    return steps.map((value) => ({ label: undefined, value }));
  }

  if (scale === logScale) {
    return decadeMarks(lower, upper).map((value) => ({ label: undefined, value }));
  }

  if (step <= 0 || (upper - lower) / step > 10) {
    return [];
  }

  const count = Math.ceil((upper - lower) / step);

  return [...Array.from({ length: count }, (_, index) => lower + index * step), upper].map(
    (value) => ({ label: undefined, value }),
  );
};

/** Puts a mark or label on the same line as a thumb centred at `fraction`. */
const markOffset = (fraction: number) =>
  `calc(${THUMB_INSET} + ${fraction} * (100% - 2 * ${THUMB_INSET}))`;

const Slider = <Value extends SliderValue = SliderValue>({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  largeStep,
  minStepsBetweenValues,
  steps: stepsProp,
  scale: scaleOption,
  marks,
  orientation,
  onValueChange,
  onValueCommitted,
  name,
  form,
  format,
  locale,
  disabled,
  ...props
}: SliderProps<Value>) => {
  // `Value` is typed by `value` or `defaultValue`; a reported value has its type when it
  // matches it: a number for a number, an array for an array.
  const isReportable = (next: SliderValue): next is ReportedValue<Value> =>
    Array.isArray(next) === Array.isArray(value ?? defaultValue ?? next);

  const steps = React.useMemo(() => normalizeSteps(stepsProp), [stepsProp]);
  const hasSteps = steps.length > 1;
  // A scale or uneven steps put Base UI on a track-position axis, translated here.
  const remapped = hasSteps || !isLinear(scaleOption);
  const lower = hasSteps ? steps[0] : min;
  const upper = (hasSteps ? steps.at(-1) : undefined) ?? max;
  const scale = resolveScale(scaleOption, lower);

  const [localValue, setLocalValue] = React.useState<SliderValue>(defaultValue ?? lower);
  // Held here even when uncontrolled, so marks can tell which side of a thumb they are on.
  const current = value ?? localValue;
  const values = [current].flat();
  const latestRef = React.useRef<SliderValue | null>(null);
  const vertical = orientation === "vertical";

  const toTrack = (next: number) =>
    TRACK_RESOLUTION * clamp(scale.toPosition(next, lower, upper), 0, 1);

  const snap = (raw: number) =>
    hasSteps ? steps[nearestIndex(steps, raw)] : clamp(roundToStep(raw, lower, step), lower, upper);

  /**
   * The value a track position stands for. Keyboard and assistive-technology input
   * moves one track unit, so it is read as a direction and moved a whole step instead.
   */
  const fromTrack = (
    track: number,
    index: number,
    stepwise: boolean,
    previousValues: readonly number[],
  ) => {
    const previous = previousValues[index] ?? lower;
    const raw = scale.toValue(track / TRACK_RESOLUTION, lower, upper);
    const delta = track - toTrack(previous);

    if (!stepwise || track <= 0 || track >= TRACK_RESOLUTION) {
      return snap(raw);
    }

    if (Math.abs(delta) < 1e-9) {
      return previous;
    }

    const direction = Math.sign(delta);
    const large = Math.abs(delta) >= TRACK_RESOLUTION / 20;

    const next = hasSteps
      ? steps[
          clamp(
            nearestIndex(steps, previous) + direction * (large ? LARGE_STEP_COUNT : 1),
            0,
            steps.length - 1,
          )
        ]
      : moveAlongScale({ direction, large, lower, scale, step, upper, value: previous });

    // Keep thumbs in order: a whole step must not jump past a neighbour.
    return clamp(next, previousValues[index - 1] ?? lower, previousValues[index + 1] ?? upper);
  };

  const formatted = (next: number) =>
    format || locale !== undefined
      ? new Intl.NumberFormat(locale, format).format(next)
      : String(next);

  const changeProps: Partial<SliderPrimitive.Root.Props> = remapped
    ? {
        largeStep: TRACK_RESOLUTION / 10,
        max: TRACK_RESOLUTION,
        min: 0,
        onValueChange: (track, details) => {
          const stepwise = details.reason === "keyboard" || details.reason === "input-change";

          const next = [track]
            .flat()
            .map((position, index) => fromTrack(position, index, stepwise, values));

          if (sameValues(next, values)) {
            return;
          }

          const nextValue: SliderValue = Array.isArray(track) ? next : next[0];

          if (isReportable(nextValue)) {
            onValueChange?.(nextValue, details);
          }

          if (details.isCanceled) {
            return;
          }

          latestRef.current = nextValue;
          setLocalValue(nextValue);
        },
        onValueCommitted: (track, details) => {
          const snapped = [track]
            .flat()
            .map((position) => snap(scale.toValue(position / TRACK_RESOLUTION, lower, upper)));

          const committed = latestRef.current ?? (Array.isArray(track) ? snapped : snapped[0]);

          latestRef.current = null;

          if (isReportable(committed)) {
            onValueCommitted?.(committed, details);
          }
        },
        step: 1,
        value: Array.isArray(current) ? values.map(toTrack) : toTrack(values[0]),
      }
    : {
        format,
        largeStep,
        locale,
        max,
        min,
        minStepsBetweenValues,
        name,
        onValueChange: (next, details) => {
          if (isReportable(next)) {
            onValueChange?.(next, details);
          }

          if (!details.isCanceled) {
            setLocalValue(next);
          }
        },
        onValueCommitted: (next, details) => {
          if (isReportable(next)) {
            onValueCommitted?.(next, details);
          }
        },
        step,
        value: current,
      };

  const markList = resolveMarks({ lower, marks, scale, step: step ?? 1, steps, upper }).map(
    (mark) => ({
      ...mark,
      offset: markOffset(clamp(scale.toPosition(mark.value, lower, upper), 0, 1)),
    }),
  );

  const first = Math.min(...values);
  const last = Math.max(...values);
  const ranged = values.length > 1;
  const labelled = markList.filter((mark) => mark.label !== undefined);

  return (
    <SliderPrimitive.Root
      className={cn(
        "w-full data-vertical:h-full data-vertical:w-auto",
        labelled.length > 0 &&
          "flex data-horizontal:flex-col data-horizontal:gap-1 data-vertical:gap-2",
        className,
      )}
      data-slot="slider"
      orientation={orientation}
      disabled={disabled}
      form={remapped ? undefined : form}
      thumbAlignment="edge"
      {...changeProps}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex min-h-control w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          {...skeletonBlock}
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-track data-horizontal:w-full data-vertical:h-full data-vertical:w-track"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-selection select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {markList.map((mark) => {
          const inRange = ranged ? mark.value >= first && mark.value <= last : mark.value <= first;
          const markStyle: CSSVariableStyle = { "--slider-mark-offset": mark.offset };

          return (
            <span
              key={mark.value}
              aria-hidden="true"
              data-slot="slider-mark"
              data-in-range={inRange || undefined}
              {...skeletonIgnore}
              className={cn(
                "pointer-events-none absolute size-0.5 rounded-full bg-muted-foreground/60 data-in-range:bg-background/80",
                vertical
                  ? "start-1/2 bottom-(--slider-mark-offset) translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
                  : "inset-s-(--slider-mark-offset) top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2",
              )}
              style={markStyle}
            />
          );
        })}
        {values.map((thumbValue, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            // Thumbs are positional: index is their identity.
            key={index}
            index={index}
            getAriaValueText={
              remapped
                ? () => {
                    const text = formatted(thumbValue);

                    if (values.length !== 2) {
                      return text;
                    }

                    return `${text} ${index === 0 ? "start" : "end"} range`;
                  }
                : undefined
            }
            className="relative block size-thumb shrink-0 rounded-full border border-ring bg-background ring-focus-halo-strong transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:bg-ring/30 focus-visible:outline-hidden active:ring-3 data-disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
      {labelled.length > 0 ? (
        <div
          aria-hidden="true"
          data-slot="slider-mark-labels"
          className="relative text-caption text-muted-foreground tabular-nums select-none"
        >
          {/* Invisible copies size the row (or column) to the largest label. */}
          <div className="invisible grid *:col-start-1 *:row-start-1">
            {labelled.map((mark) => (
              <span key={mark.value} className="whitespace-nowrap">
                {mark.label}
              </span>
            ))}
          </div>
          {labelled.map((mark) => {
            const labelStyle: CSSVariableStyle = { "--slider-mark-offset": mark.offset };

            return (
              <span
                key={mark.value}
                data-slot="slider-mark-label"
                className={cn(
                  "absolute whitespace-nowrap",
                  vertical
                    ? "start-0 bottom-(--slider-mark-offset) translate-y-1/2"
                    : "inset-s-(--slider-mark-offset) top-0 -translate-x-1/2 rtl:translate-x-1/2",
                )}
                style={labelStyle}
              >
                {mark.label}
              </span>
            );
          })}
        </div>
      ) : null}
      {remapped && name !== undefined
        ? values.map((thumbValue, index) => (
            // Base UI's own inputs hold track positions; these submit the values.
            <input
              key={index}
              type="hidden"
              name={name}
              form={form}
              disabled={disabled}
              value={thumbValue}
            />
          ))
        : null}
    </SliderPrimitive.Root>
  );
};

export { Slider };

export type { SliderMark, SliderProps };

export type { SliderScale, SliderScaleOption } from "../lib/slider-scale";
