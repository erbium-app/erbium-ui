import { RelativeTimeCard } from "@erbium/ui/components/relative-time";
import { HOUR, useDemoClock } from "../examples/use-demo-clock";

export default function RelativeTimeCardExample() {
  const now = useDemoClock();

  return (
    <p className="text-body">
      Deployed <RelativeTimeCard date={now - 3 * HOUR} locale="en" />.
    </p>
  );
}
