// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import {
  fromTrackPosition,
  getSliderAxis,
  getSliderMarks,
  isMarkInRange,
  toTrackPosition,
  TRACK_RESOLUTION,
} from "./core";

describe("slider core", () => {
  it("replaces the range with uneven steps and maps them along the track", () => {
    const axis = getSliderAxis({ steps: [4, 0.5, 1, 1] });

    expect({
      lower: axis.lower,
      remapped: axis.remapped,
      steps: axis.steps,
      track: toTrackPosition(axis, 4),
      upper: axis.upper,
    }).toStrictEqual({
      lower: 0.5,
      remapped: true,
      steps: [0.5, 1, 4],
      track: TRACK_RESOLUTION,
      upper: 4,
    });
  });

  it("moves a stepwise track change one allowed value, stopping at the next thumb", () => {
    const axis = getSliderAxis({ steps: [1, 2, 5, 10] });

    const nudge = (values: number[], index: number) =>
      fromTrackPosition(axis, {
        index,
        values,
        stepwise: true,
        track: toTrackPosition(axis, values[index] ?? 0) + 1,
      });

    expect([nudge([2], 0), nudge([2, 5], 0)]).toStrictEqual([5, 5]);
  });

  it("snaps a drag on a log scale to the step grid", () => {
    const axis = getSliderAxis({ max: 1000, min: 10, scale: "log", step: 1 });

    expect(
      fromTrackPosition(axis, {
        index: 0,
        stepwise: false,
        track: TRACK_RESOLUTION / 2,
        values: [10],
      }),
    ).toBe(100);
  });

  it("derives marks and places them as track fractions", () => {
    const marks = getSliderMarks(getSliderAxis({ max: 1000, min: 1, scale: "log" }), true);

    expect(marks.map(({ value, position }) => [value, Number(position.toFixed(3))])).toStrictEqual([
      [1, 0],
      [10, 0.333],
      [100, 0.667],
      [1000, 1],
    ]);
    expect([isMarkInRange(10, [50]), isMarkInRange(10, [20, 50])]).toStrictEqual([true, false]);
  });
});
