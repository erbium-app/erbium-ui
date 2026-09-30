// @ts-nocheck
import * as React from "react";

import { Calendar } from "../components/calendar";

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />;
}
