import { RelativeTime, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, useDemoClock } from "../examples/use-demo-clock";

/** Seven days, in seconds. */
const week = 7 * 24 * 60 * 60;

export default function RelativeTimeThresholdExample() {
  const now = useDemoClock();
  const dates = [now - 2 * HOUR, now - 6 * DAY, now - 30 * DAY, now + 90 * DAY];

  return (
    <RelativeTimeProvider locale="en" threshold={week}>
      <ul className="flex flex-col gap-1 text-caption">
        {dates.map((date) => (
          <li key={date}>
            <RelativeTime date={date} />
          </li>
        ))}
      </ul>
    </RelativeTimeProvider>
  );
}
