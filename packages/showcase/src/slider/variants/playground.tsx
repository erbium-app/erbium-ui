import { Slider } from "@erbium/ui/components/slider";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Slider>) => (
  <Slider key={JSON.stringify(args.defaultValue)} {...args} className="w-64" aria-label="Value" />
);

export default Example;
