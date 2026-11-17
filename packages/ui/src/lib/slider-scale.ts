/**
 * Shared value math for sliders: the scale that maps a value to a position along the
 * track, snapping to uneven steps, and keyboard movement on non-linear tracks.
 * `Slider` and `Control.Number` both read from here, so their scales and keys agree.
 */

/** Maps values to fractions of the track (0 at the start, 1 at the end) and back. */
interface SliderScale {
  toPosition: (value: number, min: number, max: number) => number;
  toValue: (position: number, min: number, max: number) => number;
}

/** A built-in scale name, or a custom pair of mapping functions. */
type SliderScaleOption = "linear" | "log" | SliderScale;

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

  for (const [index, candidate] of values.entries()) {
    if (Math.abs(candidate - target) < Math.abs(values[best] - target)) {
      best = index;
    }
  }

  return best;
};

const decimalPlaces = (step: number) => {
  const text = String(step);

  return text.includes("e-") ? Number(text.split("e-")[1]) : (text.split(".")[1]?.length ?? 0);
};

/**
 * Rounds a value onto `lower + n * step`. Without a step, keeps four significant
 * digits so non-linear tracks do not emit long floating-point tails.
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
 * The value one key press reaches. A linear scale moves by `step`; a non-linear
 * scale moves one percent of the track (ten with `large`), then rounds onto the
 * step grid, and moves at least one step so rounding cannot hold the value in place.
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

export {
  clamp,
  decimalPlaces,
  isLinear,
  keyDirection,
  LARGE_STEP_COUNT,
  linearScale,
  logScale,
  moveAlongScale,
  nearestIndex,
  normalizeSteps,
  resolveScale,
  roundToStep,
};

export type { SliderScale, SliderScaleOption };
