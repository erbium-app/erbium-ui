import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { useRender } from "@base-ui/react/use-render";
import { dataFlag, missingContext } from "../internal/dom";
import { useControlledState } from "../internal/use-controlled-state";
import {
  fromTrackPosition,
  getSliderAxis,
  getSliderMarks,
  isMarkInRange,
  toTrackPosition,
  TRACK_RESOLUTION,
  valueAtTrackPosition,
} from "./core";
import type { SliderAxis, SliderMark, SliderScaleOption } from "./core";

type SliderValue = number | readonly number[];

/** The value callbacks receive for a `value` of type `Value`: a number stays a number. */
type ReportedValue<Value> = Value extends number ? number : Value;

type SliderChangeDetails = BaseSlider.Root.ChangeEventDetails;

type SliderCommitDetails = BaseSlider.Root.CommitEventDetails;

/** A mark as `Slider.Marks` hands it out. */
interface SliderMarkState extends Record<string, unknown> {
  value: number;
  label: React.ReactNode;
  /** Fraction of the track, from 0 at the start to 1 at the end. */
  position: number;
  /** The mark sits between the thumbs of a range, or before the thumb of a single value. */
  inRange: boolean;
}

interface SliderContextValue {
  axis: SliderAxis;
  /** Every thumb's value, in thumb order. */
  values: readonly number[];
  marks: readonly SliderMarkState[];
  orientation: "horizontal" | "vertical";
  /** Formats a value with the root's `format` and `locale`. */
  formatValue: (value: number) => string;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);

const useSliderContext = (part: string) =>
  React.use(SliderContext) ?? missingContext(part, "<Slider.Root>");

/** The values, marks and axis of the surrounding `Slider.Root`. */
const useSlider = (): SliderContextValue => useSliderContext("useSlider");

const sameValues = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const useNumberFormat = (
  locale: Intl.LocalesArgument,
  format: Intl.NumberFormatOptions | undefined,
) =>
  React.useMemo(() => {
    if (format === undefined && locale === undefined) {
      return String;
    }

    const formatter = new Intl.NumberFormat(locale, format);

    return (value: number) => formatter.format(value);
  }, [format, locale]);

// Root

type SliderRootProps<Value extends SliderValue = SliderValue> = BaseSlider.Root.Props<Value> & {
  /**
   * Allowed values, including uneven intervals. Thumbs snap to the nearest one and arrow keys move
   * one allowed value at a time. Replaces `min`, `max` and `step`.
   */
  steps?: readonly number[] | undefined;
  /**
   * How values spread along the track: `"linear"` (default), `"log"` for ranges that span orders
   * of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`.
   */
  scale?: SliderScaleOption | undefined;
  /**
   * Tick marks along the track, handed out by `Slider.Marks`. `true` marks each allowed value
   * (`steps`, a short `step` grid, or each power of ten on a log scale). An array places marks.
   */
  marks?: boolean | readonly SliderMark<React.ReactNode>[] | undefined;
};

interface RemapInput {
  axis: SliderAxis;
  values: readonly number[];
  array: boolean;
  /** Reports a change; false when a callback cancelled it. */
  report: (next: SliderValue, details: SliderChangeDetails) => boolean;
  commit: (next: SliderValue, details: SliderCommitDetails) => void;
}

/**
 * Base UI props for a remapped slider: Base UI works on track positions, and its callbacks are
 * translated back to values.
 */
const useRemappedProps = ({ axis, values, array, report, commit }: RemapInput) => {
  // The value the last change reported, so the commit reports the same value.
  const latestRef = React.useRef<SliderValue | null>(null);

  return {
    largeStep: TRACK_RESOLUTION / 10,
    max: TRACK_RESOLUTION,
    min: 0,
    onValueChange: (track: SliderValue, details: SliderChangeDetails) => {
      const stepwise = details.reason === "keyboard" || details.reason === "input-change";

      const next = [track]
        .flat()
        .map((position, index) =>
          fromTrackPosition(axis, { index, stepwise, values, track: position }),
        );

      if (sameValues(next, values)) {
        return;
      }

      const nextValue = Array.isArray(track) ? next : (next[0] ?? axis.lower);

      if (report(nextValue, details)) {
        latestRef.current = nextValue;
      }
    },
    onValueCommitted: (track: SliderValue, details: SliderCommitDetails) => {
      const snapped = [track].flat().map((position) => valueAtTrackPosition(axis, position));

      const committed =
        latestRef.current ?? (Array.isArray(track) ? snapped : (snapped[0] ?? axis.lower));

      latestRef.current = null;
      commit(committed, details);
    },
    step: 1,
    value: array
      ? values.map((value) => toTrackPosition(axis, value))
      : toTrackPosition(axis, values[0] ?? axis.lower),
  };
};

/**
 * Holds the value and renders Base UI's slider root. With uneven `steps` or a non-linear `scale`,
 * Base UI runs on track positions and the root converts them, so callbacks, form submission and
 * the thumbs' announced values use the real values.
 */
const SliderRoot = <Value extends SliderValue = SliderValue>({
  defaultValue,
  value,
  min,
  max,
  step,
  largeStep,
  minStepsBetweenValues,
  steps,
  scale,
  marks,
  orientation = "horizontal",
  onValueChange,
  onValueCommitted,
  name,
  form,
  format,
  locale,
  disabled,
  children,
  ...props
}: SliderRootProps<Value>) => {
  const axis = React.useMemo(
    () => getSliderAxis({ max, min, scale, step, steps }),
    [max, min, scale, step, steps],
  );

  const [current, setCurrent] = useControlledState<SliderValue>(value, defaultValue ?? axis.lower);
  const values = React.useMemo(() => [current].flat(), [current]);
  const formatValue = useNumberFormat(locale, format);

  // `Value` is typed by `value` or `defaultValue`; a reported value has its type when it matches
  // it: a number for a number, an array for an array.
  const isReportable = (next: SliderValue): next is ReportedValue<Value> =>
    Array.isArray(next) === Array.isArray(value ?? defaultValue ?? next);

  const report = (next: SliderValue, details: SliderChangeDetails) => {
    if (isReportable(next)) {
      onValueChange?.(next, details);
    }

    if (details.isCanceled) {
      return false;
    }

    setCurrent(next);

    return true;
  };

  const commit = (next: SliderValue, details: SliderCommitDetails) => {
    if (isReportable(next)) {
      onValueCommitted?.(next, details);
    }
  };

  const remappedProps = useRemappedProps({
    array: Array.isArray(current),
    axis,
    commit,
    report,
    values,
  });

  const changeProps = axis.remapped
    ? remappedProps
    : {
        form,
        format,
        largeStep,
        locale,
        minStepsBetweenValues,
        name,
        step,
        max: axis.upper,
        min: axis.lower,
        onValueChange: (next: SliderValue, details: SliderChangeDetails) => {
          report(next, details);
        },
        onValueCommitted: commit,
        value: current,
      };

  const context = React.useMemo<SliderContextValue>(
    () => ({
      axis,
      formatValue,
      orientation,
      values,
      marks: getSliderMarks(axis, marks).map((mark) => ({
        inRange: isMarkInRange(mark.value, values),
        label: mark.label,
        position: mark.position,
        value: mark.value,
      })),
    }),
    [axis, formatValue, marks, orientation, values],
  );

  return (
    <SliderContext value={context}>
      <BaseSlider.Root disabled={disabled} orientation={orientation} {...changeProps} {...props}>
        {children}
        {axis.remapped && name !== undefined
          ? values.map((thumbValue, index) => (
              // Base UI's own inputs hold track positions; these submit the values.
              <input
                // One input per thumb, in thumb order.
                // oxlint-disable-next-line react-doctor/no-array-index-as-key
                key={index}
                type="hidden"
                name={name}
                form={form}
                disabled={disabled}
                value={thumbValue}
              />
            ))
          : null}
      </BaseSlider.Root>
    </SliderContext>
  );
};

// Thumbs

type SliderThumbProps = BaseSlider.Thumb.Props;

const rangeEnd = (index: number) => (index === 0 ? "start" : "end");

/**
 * A thumb. On a remapped slider it announces the real value, formatted with the root's `format`
 * and `locale`; `getAriaValueText` receives that text and value.
 */
const SliderThumb = ({ getAriaValueText, ...props }: SliderThumbProps) => {
  const { axis, values, formatValue } = useSliderContext("Slider.Thumb");

  const valueText: SliderThumbProps["getAriaValueText"] = axis.remapped
    ? (_formatted, _track, index) => {
        const thumbValue = values[index] ?? axis.lower;
        const text = formatValue(thumbValue);

        if (getAriaValueText) {
          return getAriaValueText(text, thumbValue, index);
        }

        return values.length === 2 ? `${text} ${rangeEnd(index)} range` : text;
      }
    : getAriaValueText;

  return <BaseSlider.Thumb getAriaValueText={valueText} {...props} />;
};

/** One `Slider.Thumb` per value, in thumb order. Takes the props of every thumb. */
const SliderThumbs = (props: Omit<SliderThumbProps, "index">): React.ReactNode => {
  const { values } = useSliderContext("Slider.Thumbs");

  return values.map((_, index) => (
    // Thumbs are positional: the index is their identity.
    // oxlint-disable-next-line react-doctor/no-array-index-as-key
    <SliderThumb key={index} index={index} {...props} />
  ));
};

// Marks

interface SliderMarksProps {
  /** Renders one mark. Marks supplies stable keys. */
  children: (mark: SliderMarkState) => React.ReactNode;
}

/** Renders the root's marks in track order. Renders no element. */
const SliderMarks = ({ children }: SliderMarksProps): React.ReactNode => {
  const { marks } = useSliderContext("Slider.Marks");

  return marks.map((mark) => <React.Fragment key={mark.value}>{children(mark)}</React.Fragment>);
};

interface SliderMarkProps extends useRender.ComponentProps<"span", SliderMarkState> {
  /** The mark, from `Slider.Marks`. */
  mark: SliderMarkState;
}

type MarkStyle = React.CSSProperties & Record<"--slider-mark-position", number>;

const markProps = (mark: SliderMarkState, style: React.CSSProperties | undefined) => {
  // A number from 0 to 1: offset the mark along the track with it in CSS.
  const markStyle: MarkStyle = { "--slider-mark-position": mark.position, ...style };

  return { "aria-hidden": true, "data-in-range": dataFlag(mark.inRange), style: markStyle };
};

const hiddenState = {
  inRange: () => null,
  label: () => null,
  position: () => null,
  value: () => null,
};

/**
 * A tick on the track. Hidden from assistive technology, since the thumbs announce the value. Sets
 * `--slider-mark-position` (0 to 1) and `data-in-range`.
 */
const SliderMarkPart = ({ mark, render, style, ...props }: SliderMarkProps) =>
  useRender({
    render,
    defaultTagName: "span",
    props: mergeProps<"span">(markProps(mark, style), props),
    state: mark,
    stateAttributesMapping: hiddenState,
  });

/**
 * A mark's label, beside the track. Hidden from assistive technology like the mark. Its text is
 * the mark's `label`.
 */
const SliderMarkLabel = ({ mark, render, style, ...props }: SliderMarkProps) =>
  useRender({
    render,
    defaultTagName: "span",
    props: mergeProps<"span">({ children: mark.label, ...markProps(mark, style) }, props),
    state: mark,
    stateAttributesMapping: hiddenState,
  });

export {
  SliderMarkLabel,
  SliderMarkPart as SliderMark,
  SliderMarks,
  SliderRoot,
  SliderThumb,
  SliderThumbs,
  useSlider,
};

export type {
  SliderChangeDetails,
  SliderCommitDetails,
  SliderContextValue as SliderContext,
  SliderMarkProps,
  SliderMarkState,
  SliderMarksProps,
  SliderRootProps,
  SliderThumbProps,
  SliderValue,
};
