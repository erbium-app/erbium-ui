import { SegmentedControlIndicator } from "./parts";

/**
 * The sliding indicator of a segmented control. The segments come from Base UI: Radio Group for
 * a value, Toggle Group for a filter that can be cleared, or links for navigation. `Indicator`
 * follows whichever segment is active.
 */
const SegmentedControl = {
  Indicator: SegmentedControlIndicator,
};

export { SegmentedControl };

export type { SegmentedControlIndicatorProps, SegmentedControlIndicatorState } from "./parts";

export * from "./core";
