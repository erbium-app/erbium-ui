import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@erbium/ui/components/item";
import { RelativeTime, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, useDemoClock } from "./use-demo-clock";

export default function RelativeTimeExample() {
  const now = useDemoClock();

  const events = [
    { name: "Comment added", date: now },
    { name: "Build finished", date: now - 3 * HOUR },
    { name: "Workspace created", date: now - 740 * DAY },
    { name: "Review due", date: now + 4 * DAY },
    { name: "Plan renews", date: now + 65 * DAY },
  ];

  return (
    <RelativeTimeProvider locale="en">
      <ItemGroup className="w-80">
        {events.map((event) => (
          <Item key={event.name} size="sm">
            <ItemContent>
              <ItemTitle>{event.name}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <RelativeTime date={event.date} className="text-muted-foreground" />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </RelativeTimeProvider>
  );
}
