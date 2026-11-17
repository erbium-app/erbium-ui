import { Progress } from "@erbium/ui/components/progress";
import type * as React from "react";
import { cn } from "@erbium/ui/lib/utils";

export const defaultProps = { className: "", value: 45 } satisfies React.ComponentProps<
  typeof Progress
>;

export default function ProgressPlaygroundExample(
  args: React.ComponentProps<typeof Progress> = defaultProps,
) {
  return <Progress {...args} className={cn("w-72", args.className)} />;
}
