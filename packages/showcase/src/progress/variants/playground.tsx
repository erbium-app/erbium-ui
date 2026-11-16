import { Progress } from "@erbium/ui/components/progress";
import type * as React from "react";
import { cn } from "@erbium/ui/lib/utils";

const Example = (args: React.ComponentProps<typeof Progress>) => (
  <Progress {...args} className={cn("w-72", args.className)} />
);

export default Example;
