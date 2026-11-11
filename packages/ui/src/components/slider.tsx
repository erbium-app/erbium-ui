import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "../lib/utils";

const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) => {
  const _values = [value ?? defaultValue ?? min].flat();

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex min-h-control control-adaptive w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-track data-horizontal:w-full data-vertical:h-full data-vertical:w-track"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-selection select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-thumb shrink-0 rounded-full border border-ring bg-background ring-focus-halo-strong transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:bg-ring/30 focus-visible:outline-hidden active:ring-3 data-disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
};

export { Slider };
