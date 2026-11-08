import * as React from "react";

import { Calendar } from "@erbium/ui/components/calendar";

export const CalendarMultiple = () => {
  const [dates, setDates] = React.useState<Date[] | undefined>(() => {
    const year = new Date().getFullYear();

    return [new Date(year, 5, 9), new Date(year, 5, 12), new Date(year, 5, 18)];
  });

  return (
    <Calendar
      mode="multiple"
      defaultMonth={dates?.[0]}
      selected={dates}
      onSelect={setDates}
      max={5}
    />
  );
};
