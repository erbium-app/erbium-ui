// @ts-nocheck
import * as React from "react";
import { Calendar } from "../components/calendar";

export default function CalendarTimezone() {
  const [date, setDate] = React.useState<Date>();
  const [timeZone, setTimeZone] = React.useState<string>();

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return <Calendar mode="single" onSelect={setDate} selected={date} timeZone={timeZone} />;
}
