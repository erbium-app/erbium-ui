import { cn } from "@erbium/ui/lib/utils";

import { Slider } from "@erbium/ui/components/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export const defaultProps = {} satisfies SliderProps;

export default function SliderExample({ className, ...props }: SliderProps = defaultProps) {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn("w-[60%]", className)}
      {...props}
    />
  );
}
