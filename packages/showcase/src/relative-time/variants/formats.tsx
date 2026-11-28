import { RelativeTime, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, MINUTE, useDemoClock } from "../examples/use-demo-clock";

const formats = [
  { label: "Long", props: {} },
  { label: "Short", props: { formatStyle: "short" } },
  { label: "Narrow", props: { formatStyle: "narrow" } },
  { label: "Numbers only", props: { numeric: "always" } },
  { label: "Duration", props: { format: "duration" } },
] as const;

export default function RelativeTimeFormatsExample() {
  const now = useDemoClock();
  const dates = [now - 5 * MINUTE, now - DAY];

  return (
    <RelativeTimeProvider locale="en">
      <dl className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-2 text-caption">
        {formats.map(({ label, props }) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            {dates.map((date) => (
              <dd key={date}>
                <RelativeTime date={date} {...props} />
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </RelativeTimeProvider>
  );
}
