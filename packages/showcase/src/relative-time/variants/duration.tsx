import { Button } from "@erbium/ui/components/button";
import { RelativeTime } from "@erbium/ui/components/relative-time";
import { useState } from "react";
import { MINUTE, useDemoClock } from "../examples/use-demo-clock";

export default function RelativeTimeDurationExample() {
  const now = useDemoClock();
  const [restarted, setRestarted] = useState<number>();
  const startedAt = restarted ?? now;

  return (
    <div className="flex flex-col items-center gap-group text-caption">
      <p>
        Running for <RelativeTime date={startedAt} format="duration" maxUnits={2} locale="en" />
      </p>
      <p>
        Session ends in{" "}
        <RelativeTime date={startedAt + 5 * MINUTE} format="duration" maxUnits={2} locale="en" />
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setRestarted(Date.now());
        }}
      >
        Restart
      </Button>
    </div>
  );
}
