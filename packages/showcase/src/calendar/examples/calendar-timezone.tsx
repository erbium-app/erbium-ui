import * as React from "react";
import { Calendar } from "@erbium/ui/components/calendar";

// The time zone never changes during a session, so there is nothing to subscribe to.
const subscribe = () => () => {
  // Nothing to clean up.
};

const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// The server has no user time zone; the calendar renders in UTC until hydration.
const getServerTimeZone = () => "UTC";

const CalendarTimezone = () => {
  const [date, setDate] = React.useState<Date>();
  const timeZone = React.useSyncExternalStore(subscribe, getTimeZone, getServerTimeZone);

  return <Calendar mode="single" onSelect={setDate} selected={date} timeZone={timeZone} />;
};

export default CalendarTimezone;
