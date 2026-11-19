import { Slider as SliderPrimitive, useSlider } from "@erbium-ui/react/slider";
import type {
  SliderMark as SliderMarkInput,
  SliderRootProps,
  SliderValue,
} from "@erbium-ui/react/slider";
import type * as React from "react";
import { skeletonBlock, skeletonIgnore } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";

/** A tick on the track. A mark with a `label` also shows it beside the track. */
type SliderMark = SliderMarkInput<React.ReactNode>;

type SliderProps<Value extends SliderValue = SliderValue> = SliderRootProps<Value>;

/*
 * With edge alignment a thumb's centre stays half of `size-thumb` (0.375rem) inside each end, so
 * marks and labels are offset onto the same line: inset + position * (100% - 2 * inset).
 */
const markOffset: CSSVariableStyle = {
  "--slider-mark-offset": "calc(0.375rem + var(--slider-mark-position) * (100% - 0.75rem))",
};

const markLineClassName = {
  horizontal:
    "inset-s-(--slider-mark-offset) top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2",
  vertical:
    "start-1/2 bottom-(--slider-mark-offset) -translate-x-1/2 translate-y-1/2 rtl:translate-x-1/2",
};

const labelLineClassName = {
  horizontal: "inset-s-(--slider-mark-offset) top-0 -translate-x-1/2 rtl:translate-x-1/2",
  vertical: "start-0 bottom-(--slider-mark-offset) translate-y-1/2",
};

/** The labelled marks beside the track, in a row (or column) sized to the largest label. */
const SliderMarkLabels = () => {
  const { marks, orientation } = useSlider();
  const labelled = marks.filter((mark) => mark.label !== undefined);

  if (labelled.length === 0) {
    return null;
  }

  return (
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
      {labelled.map((mark) => (
        <SliderPrimitive.MarkLabel
          key={mark.value}
          mark={mark}
          data-slot="slider-mark-label"
          className={cn("absolute whitespace-nowrap", labelLineClassName[orientation])}
          style={markOffset}
        />
      ))}
    </div>
  );
};

const Slider = <Value extends SliderValue = SliderValue>({
  className,
  orientation = "horizontal",
  ...props
}: SliderProps<Value>) => (
  <SliderPrimitive.Root
    className={cn(
      "w-full data-vertical:h-full data-vertical:w-auto",
      "has-data-[slot=slider-mark-labels]:flex has-data-[slot=slider-mark-labels]:data-horizontal:flex-col has-data-[slot=slider-mark-labels]:data-horizontal:gap-1 has-data-[slot=slider-mark-labels]:data-vertical:gap-2",
      className,
    )}
    data-slot="slider"
    orientation={orientation}
    thumbAlignment="edge"
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
      <SliderPrimitive.Marks>
        {(mark) => (
          <SliderPrimitive.Mark
            mark={mark}
            data-slot="slider-mark"
            {...skeletonIgnore}
            className={cn(
              "pointer-events-none absolute size-0.5 rounded-full bg-muted-foreground/60 data-in-range:bg-background/80",
              markLineClassName[orientation],
            )}
            style={markOffset}
          />
        )}
      </SliderPrimitive.Marks>
      <SliderPrimitive.Thumbs
        data-slot="slider-thumb"
        className="relative block size-thumb shrink-0 rounded-full border border-ring bg-background ring-focus-halo-strong transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:bg-ring/30 focus-visible:outline-hidden active:ring-3 data-disabled:pointer-events-none"
      />
    </SliderPrimitive.Control>
    <SliderMarkLabels />
  </SliderPrimitive.Root>
);

export { Slider };

export type { SliderMark, SliderProps };

export type { SliderScale, SliderScaleOption } from "@erbium-ui/react/slider";
