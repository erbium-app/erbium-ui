import { DirectionProvider } from "@erbium/ui/components/direction";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@erbium/ui/components/item";
import { RelativeTimeCard, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, MINUTE, useDemoClock } from "../examples/use-demo-clock";

export default function RelativeTimeRtlExample() {
  const now = useDemoClock();

  const events = [
    { name: "دیدگاه تازه", date: now - 5 * MINUTE },
    { name: "ساخت پایان یافت", date: now - 3 * HOUR },
    { name: "مهلت بازبینی", date: now + 4 * DAY },
  ];

  return (
    // The app's direction and language. Pass the same locale to the times.
    <DirectionProvider direction="rtl">
      <RelativeTimeProvider locale="fa-IR">
        <div dir="rtl" lang="fa" className="w-80">
          <ItemGroup>
            {events.map((event) => (
              <Item key={event.name} size="sm">
                <ItemContent>
                  <ItemTitle>{event.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <RelativeTimeCard date={event.date} />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </RelativeTimeProvider>
    </DirectionProvider>
  );
}
