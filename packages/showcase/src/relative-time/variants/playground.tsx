import { RelativeTime } from "@erbium/ui/components/relative-time";
import type { RelativeTimeProps } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, MINUTE, useDemoClock } from "../examples/use-demo-clock";

/** How far from now each choice is. */
export const distances = {
  "-2 years": -740 * DAY,
  "-3 hours": -3 * HOUR,
  "-26 hours": -26 * HOUR,
  now: 0,
  "+5 minutes": 5 * MINUTE,
  "+4 days": 4 * DAY,
  "+2 months": 65 * DAY,
};

type PlaygroundProps = Pick<
  RelativeTimeProps,
  "format" | "formatStyle" | "locale" | "maxUnits" | "numeric"
> & { distance: keyof typeof distances };

export const defaultProps = {
  distance: "-3 hours",
  format: "relative",
  formatStyle: "long",
  locale: "en",
  maxUnits: 1,
  numeric: "auto",
} satisfies PlaygroundProps;

export default function RelativeTimePlaygroundExample({
  distance,
  ...props
}: PlaygroundProps = defaultProps) {
  const now = useDemoClock();

  return <RelativeTime date={now + distances[distance]} className="text-title" {...props} />;
}
