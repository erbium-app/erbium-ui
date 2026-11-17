import { Slider } from "@erbium/ui/components/slider";
import type * as React from "react";

export const defaultProps = {
  defaultValue: [50],
  disabled: false,
  marks: false,
  max: 100,
  min: 0,
  step: 1,
} satisfies React.ComponentProps<typeof Slider>;

export default function SliderPlaygroundExample(
  args: React.ComponentProps<typeof Slider> = defaultProps,
) {
  return (
    <Slider key={JSON.stringify(args.defaultValue)} {...args} className="w-64" aria-label="Value" />
  );
}
