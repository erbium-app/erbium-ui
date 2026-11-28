import { Badge } from "@erbium/ui/components/badge";
import { RelativeTime, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, useDemoClock } from "../examples/use-demo-clock";

export default function RelativeTimeStateExample() {
  const now = useDemoClock();
  const deadlines = [now - 2 * DAY, now + DAY, now + 12 * DAY];

  return (
    <RelativeTimeProvider locale="en">
      <div className="flex flex-wrap justify-center gap-related">
        {deadlines.map((date) => (
          // `render` swaps the element, and `children` can write from the state.
          <RelativeTime
            key={date}
            date={date}
            render={(props, state) => (
              <Badge
                variant={state.tense === "past" ? "error" : "secondary"}
                render={<time />}
                {...props}
              />
            )}
          >
            {(state) => (state.tense === "past" ? `Overdue, ${state.text}` : `Due ${state.text}`)}
          </RelativeTime>
        ))}
      </div>
    </RelativeTimeProvider>
  );
}
