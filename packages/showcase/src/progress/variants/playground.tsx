import { ProgressTrack, ProgressIndicator } from "@erbium/ui/components/progress";
import { Progress } from "@erbium/ui/components/progress";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Progress>) => (
  <Progress
    {...args}
    className={`w-72 ${typeof args.className === "string" ? args.className : ""}`}
  >
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
  </Progress>
);

export default Example;
