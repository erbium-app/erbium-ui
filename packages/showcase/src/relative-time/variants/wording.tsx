import { RelativeTime } from "@erbium/ui/components/relative-time";
import type { RelativeTimeProps } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, useDemoClock } from "../examples/use-demo-clock";

type Labels = NonNullable<RelativeTimeProps["labels"]>;

// Define labels once, outside render. Each function receives a duration in the same language.
const english: Labels = {
  future: (duration) => `${duration} later`,
  now: "this moment",
  past: (duration) => `${duration} earlier`,
};

const persian: Labels = {
  future: (duration) => `${duration} دیگر`,
  now: "همین حالا",
  past: (duration) => `${duration} پیش`,
};

export default function RelativeTimeWordingExample() {
  const now = useDemoClock();
  const dates = [now - 3 * DAY - 4 * HOUR, now, now + 65 * DAY];

  return (
    <div className="flex flex-wrap justify-center gap-12 text-caption">
      <div className="flex flex-col gap-1">
        {dates.map((date) => (
          <RelativeTime key={date} date={date} locale="en" labels={english} />
        ))}
      </div>
      {/* Two units need labels outside English; without them the time uses one unit. */}
      <div dir="rtl" className="flex flex-col gap-1">
        {dates.map((date) => (
          <RelativeTime key={date} date={date} locale="fa-IR" labels={persian} maxUnits={2} />
        ))}
      </div>
    </div>
  );
}
