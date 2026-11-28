import { CopyButton, CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";
import {
  RelativeTime,
  RelativeTimeCard,
  RelativeTimeCardContent,
  RelativeTimeCardTitle,
  RelativeTimeCardTrigger,
  RelativeTimeZone,
  RelativeTimeZoneList,
} from "@erbium/ui/components/relative-time";
import { DAY, useDemoClock } from "../examples/use-demo-clock";

export default function RelativeTimeCardZonesExample() {
  const date = new Date(useDemoClock() + 2 * DAY);

  return (
    <RelativeTimeCard date={date} locale="en">
      <RelativeTimeCardTrigger render={<Button variant="outline" />}>
        Launch <RelativeTime />
      </RelativeTimeCardTrigger>
      <RelativeTimeCardContent>
        <RelativeTimeCardTitle />
        <RelativeTimeZoneList>
          <RelativeTimeZone hideIfSameAs={["Europe/London", "Asia/Tehran", "Asia/Tokyo"]} />
          <RelativeTimeZone timeZone="Europe/London" label="London" />
          <RelativeTimeZone timeZone="Asia/Tehran" label="Tehran" />
          <RelativeTimeZone timeZone="Asia/Tokyo" label="Tokyo" />
        </RelativeTimeZoneList>
        <CopyButton value={date.toISOString()} size="sm" variant="outline">
          <CopyButtonIcon data-icon="inline-start" />
          <CopyButtonLabel>Copy ISO time</CopyButtonLabel>
        </CopyButton>
      </RelativeTimeCardContent>
    </RelativeTimeCard>
  );
}
