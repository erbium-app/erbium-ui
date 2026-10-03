import * as React from "react";
import { Calendar } from "@erbium/ui/components/calendar";

export default function CalendarTimezone() {
  const [date, setDate] = React.useState<Date>();
  const timeZone = React.useSyncExternalStore(
    () => () => {},
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => undefined,
  );

  return <Calendar mode="single" onSelect={setDate} selected={date} timeZone={timeZone} />;
}
