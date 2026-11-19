import { Slider as BaseSlider } from "@base-ui/react/slider";
import {
  SliderMark,
  SliderMarkLabel,
  SliderMarks,
  SliderRoot,
  SliderThumb,
  SliderThumbs,
} from "./parts";

/**
 * A slider on Base UI's slider with uneven steps, non-linear scales and marks: `Root` holds the
 * value, `Control`, `Track` and `Indicator` are Base UI's parts, `Thumbs` renders a thumb per
 * value, and `Marks` hands out the marks for `Mark` and `MarkLabel`.
 */
const Slider = {
  Control: BaseSlider.Control,
  Indicator: BaseSlider.Indicator,
  Label: BaseSlider.Label,
  Mark: SliderMark,
  MarkLabel: SliderMarkLabel,
  Marks: SliderMarks,
  Root: SliderRoot,
  Thumb: SliderThumb,
  Thumbs: SliderThumbs,
  Track: BaseSlider.Track,
};

export { Slider };

export { useSlider } from "./parts";

export type {
  SliderChangeDetails,
  SliderCommitDetails,
  SliderContext,
  SliderMarkProps,
  SliderMarkState,
  SliderMarksProps,
  SliderRootProps,
  SliderThumbProps,
  SliderValue,
} from "./parts";

export * from "./core";
