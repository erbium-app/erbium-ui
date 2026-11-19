/**
 * Value math for sliders: the scale that maps a value to a position along the track, snapping to
 * uneven steps, keyboard movement on non-linear tracks, and marks. Pure functions, so they run on
 * the server or the client, and any control that lays values along a track can share them.
 */

/** Maps values to fractions of the track (0 at the start, 1 at the end) and back. */
interface SliderScale {
  toPosition: (value: number, min: number, max: number) => number;
  toValue: (position: number, min: number, max: number) => number;
}

/** A built-in scale name, or a custom pair of mapping functions. */
type SliderScaleOption = "linear" | "log" | SliderScale;

/** A tick on the track. A mark with a `label` also shows the label beside the track. */
interface SliderMark<TLabel = unknown> {
  value: number;
  label?: TLabel;
}

/** A mark placed on the track. */
interface SliderMarkPosition<TLabel = unknown> extends SliderMark<TLabel> {
  /** Fraction of the track, from 0 at the start to 1 at the end. */
  position: number;
}

const clamp = (value: number, lower: number, upper: number) =>
  Math.max(lower, Math.min(upper, value));

const linearScale: SliderScale = {
  toPosition: (value, min, max) => (max === min ? 0 : (value - min) / (max - min)),
  toValue: (position, min, max) => min + position * (max - min),
};

/** Equal track distances cover equal ratios, e.g. 20 → 200 → 2000. Requires min > 0. */
const logScale: SliderScale = {
  toPosition: (value, min, max) =>
    max === min ? 0 : Math.log(Math.max(value, min) / min) / Math.log(max / min),
  toValue: (position, min, max) => min * (max / min) ** position,
};

const isLinear = (option: SliderScaleOption | undefined) =>
  option === undefined || option === "linear" || option === linearScale;

/** Resolves a scale option. A log scale needs a positive range and falls back to linear. */
const resolveScale = (option: SliderScaleOption | undefined, min: number): SliderScale => {
  if (option === "log") {
    return min > 0 ? logScale : linearScale;
  }

  if (option === undefined || option === "linear") {
    return linearScale;
  }

  return option;
};

/** Sorted, de-duplicated, finite allowed values. */
const normalizeSteps = (steps: readonly number[] | undefined) =>
  steps === undefined ? [] : [...new Set(steps.filter(Number.isFinite))].toSorted((a, b) => a - b);

/** Index of the entry in `values` closest to `target`. */
const nearestIndex = (values: readonly number[], target: number) => {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [index, candidate] of values.entries()) {
    const distance = Math.abs(candidate - target);

    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }

  return best;
};

const decimalPlaces = (step: number) => {
  const text = String(step);

  return text.includes("e-") ? Number(text.split("e-")[1]) : (text.split(".")[1]?.length ?? 0);
};

/**
 * Rounds a value onto `lower + n * step`. Without a step, keeps four significant digits so
 * non-linear tracks do not emit long floating-point tails.
 */
const roundToStep = (value: number, lower: number, step: number | undefined) => {
  if (step === undefined || step <= 0) {
    return value === 0 ? 0 : Number(value.toPrecision(4));
  }

  const stepped = lower + Math.round((value - lower) / step) * step;

  return Number(stepped.toFixed(decimalPlaces(step)));
};

/** +1 or -1 for keys that move toward the end or start of the track, 0 otherwise. */
const keyDirection = (key: string, rtl: boolean) => {
  if (key === "ArrowRight") {
    return rtl ? -1 : 1;
  }

  if (key === "ArrowLeft") {
    return rtl ? 1 : -1;
  }

  if (key === "ArrowUp" || key === "PageUp") {
    return 1;
  }

  if (key === "ArrowDown" || key === "PageDown") {
    return -1;
  }

  return 0;
};

/** Steps one large keyboard move covers: Shift+arrow and Page keys. */
const LARGE_STEP_COUNT = 10;

/** Fraction of the track one arrow press covers on a non-linear scale. */
const KEY_POSITION_STEP = 0.01;

interface ScaleMove {
  value: number;
  direction: number;
  large: boolean;
  scale: SliderScale;
  lower: number;
  upper: number;
  step: number | undefined;
}

/**
 * The value one key press reaches. A linear scale moves by `step`; a non-linear scale moves one
 * percent of the track (ten with `large`), then rounds onto the step grid, and moves at least one
 * step so rounding cannot hold the value in place.
 */
const moveAlongScale = ({ value, direction, large, scale, lower, upper, step }: ScaleMove) => {
  const count = large ? LARGE_STEP_COUNT : 1;

  if (scale === linearScale && step !== undefined && step > 0) {
    return clamp(roundToStep(value + direction * step * count, lower, step), lower, upper);
  }

  const position = clamp(
    scale.toPosition(value, lower, upper) + direction * KEY_POSITION_STEP * count,
    0,
    1,
  );

  let next = roundToStep(scale.toValue(position, lower, upper), lower, step);

  if (next === value && step !== undefined && step > 0) {
    next = value + direction * step;
  }

  return clamp(next, lower, upper);
};

// Axis

/** Track positions a remapped slider works in: `0` to `TRACK_RESOLUTION`. */
const TRACK_RESOLUTION = 1000;

interface SliderAxisOptions {
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  steps?: readonly number[] | undefined;
  scale?: SliderScaleOption | undefined;
}

/** The values a slider can take and how they spread along its track. */
interface SliderAxis {
  /** The first value: `min`, or the first allowed value. */
  lower: number;
  /** The last value: `max`, or the last allowed value. */
  upper: number;
  /** Sorted allowed values. Empty when the slider uses `step`. */
  steps: readonly number[];
  step: number | undefined;
  scale: SliderScale;
  /**
   * Whether uneven steps or a non-linear scale put the slider on track positions, which
   * `toTrackPosition` and `fromTrackPosition` translate.
   */
  remapped: boolean;
}

/** Resolves a slider's range, steps and scale. `steps` replaces `min`, `max` and `step`. */
const getSliderAxis = ({
  min = 0,
  max = 100,
  step,
  steps: stepsOption,
  scale: scaleOption,
}: SliderAxisOptions): SliderAxis => {
  const steps = normalizeSteps(stepsOption);
  const [first] = steps;
  const last = steps.at(-1);
  const hasSteps = steps.length > 1 && first !== undefined && last !== undefined;
  const lower = hasSteps ? first : min;
  const upper = hasSteps ? last : max;

  return {
    lower,
    step,
    upper,
    remapped: hasSteps || !isLinear(scaleOption),
    scale: resolveScale(scaleOption, lower),
    steps: hasSteps ? steps : [],
  };
};

/** The fraction of the track a value sits at, from 0 to 1. */
const positionOf = (axis: SliderAxis, value: number) =>
  clamp(axis.scale.toPosition(value, axis.lower, axis.upper), 0, 1);

/** The track position, from 0 to `TRACK_RESOLUTION`, of a value. */
const toTrackPosition = (axis: SliderAxis, value: number) =>
  TRACK_RESOLUTION * positionOf(axis, value);

/** The allowed value nearest to `value`: the nearest step, or `value` rounded onto `step`. */
const snapValue = (axis: SliderAxis, value: number) =>
  axis.steps.length > 0
    ? (axis.steps[nearestIndex(axis.steps, value)] ?? value)
    : clamp(roundToStep(value, axis.lower, axis.step), axis.lower, axis.upper);

/** The allowed value under a track position. */
const valueAtTrackPosition = (axis: SliderAxis, track: number) =>
  snapValue(axis, axis.scale.toValue(track / TRACK_RESOLUTION, axis.lower, axis.upper));

interface TrackMove {
  /** The track position the thumb moved to. */
  track: number;
  /** The thumb that moved. */
  index: number;
  /** Every thumb's value before the move. */
  values: readonly number[];
  /**
   * A keyboard or assistive-technology move. These move one track unit, so the move is read as a
   * direction and taken as a whole step.
   */
  stepwise: boolean;
}

/**
 * The value a thumb moved to a track position stands for. A stepwise move goes one allowed value
 * (ten for a large move) and stops at the neighbouring thumbs, so thumbs stay in order.
 */
const fromTrackPosition = (axis: SliderAxis, { track, index, values, stepwise }: TrackMove) => {
  const { lower, upper, steps, scale, step } = axis;
  const previous = values[index] ?? lower;

  if (!stepwise || track <= 0 || track >= TRACK_RESOLUTION) {
    return valueAtTrackPosition(axis, track);
  }

  const delta = track - toTrackPosition(axis, previous);

  if (Math.abs(delta) < 1e-9) {
    return previous;
  }

  const direction = Math.sign(delta);
  const large = Math.abs(delta) >= TRACK_RESOLUTION / 20;
  const count = large ? LARGE_STEP_COUNT : 1;

  const next =
    steps.length > 0
      ? (steps[clamp(nearestIndex(steps, previous) + direction * count, 0, steps.length - 1)] ??
        previous)
      : moveAlongScale({ direction, large, lower, scale, step, upper, value: previous });

  return clamp(next, values[index - 1] ?? lower, values[index + 1] ?? upper);
};

// Marks

/** Each power of ten inside the range, plus both ends. */
const decadeMarks = (lower: number, upper: number) => {
  const marks = new Set([lower, upper]);

  for (let decade = 10 ** Math.ceil(Math.log10(lower)); decade < upper; decade *= 10) {
    marks.add(decade);
  }

  return [...marks].toSorted((a, b) => a - b);
};

/** The value of each mark `marks={true}` derives: the steps, decades on a log scale, or a short step grid. */
const derivedMarkValues = ({ lower, upper, steps, scale, step = 1 }: SliderAxis) => {
  if (steps.length > 0) {
    return steps;
  }

  if (scale === logScale) {
    return decadeMarks(lower, upper);
  }

  if (step <= 0 || (upper - lower) / step > 10) {
    return [];
  }

  const count = Math.ceil((upper - lower) / step);

  return [...Array.from({ length: count }, (_, index) => lower + index * step), upper];
};

/**
 * Marks placed on the track. `true` derives them from the axis; an array keeps the marks inside the
 * range.
 */
const getSliderMarks = <TLabel>(
  axis: SliderAxis,
  marks: boolean | readonly SliderMark<TLabel>[] | undefined,
): SliderMarkPosition<TLabel>[] => {
  if (marks === undefined || marks === false) {
    return [];
  }

  const list: readonly SliderMark<TLabel>[] =
    marks === true
      ? derivedMarkValues(axis).map((value) => ({ value }))
      : marks.filter((mark) => mark.value >= axis.lower && mark.value <= axis.upper);

  return list.map((mark) => ({ ...mark, position: positionOf(axis, mark.value) }));
};

/**
 * Whether a mark sits on the selected part of the track: between the thumbs of a range, or before
 * the thumb of a single value.
 */
const isMarkInRange = (value: number, values: readonly number[]) => {
  if (values.length === 0) {
    return false;
  }

  const first = Math.min(...values);

  return values.length > 1 ? value >= first && value <= Math.max(...values) : value <= first;
};

export {
  clamp,
  decimalPlaces,
  fromTrackPosition,
  getSliderAxis,
  getSliderMarks,
  isLinear,
  isMarkInRange,
  keyDirection,
  LARGE_STEP_COUNT,
  linearScale,
  logScale,
  moveAlongScale,
  nearestIndex,
  normalizeSteps,
  positionOf,
  resolveScale,
  roundToStep,
  snapValue,
  toTrackPosition,
  TRACK_RESOLUTION,
  valueAtTrackPosition,
};

export type {
  SliderAxis,
  SliderAxisOptions,
  SliderMark,
  SliderMarkPosition,
  SliderScale,
  SliderScaleOption,
  TrackMove,
};
