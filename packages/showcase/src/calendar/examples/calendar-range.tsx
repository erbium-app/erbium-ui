import * as React from "react";

import { Calendar } from "@erbium/ui/components/calendar";
import type { DateRange } from "@erbium/ui/components/calendar";
import { addDays } from "@erbium/ui/lib/date";

export const CalendarRange = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date(new Date().getFullYear(), 0, 12);

    return { from, to: addDays(from, 30) };
  });

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
    />
  );
};
