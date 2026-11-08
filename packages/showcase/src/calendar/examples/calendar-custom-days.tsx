import * as React from "react";

import { Calendar, CalendarDayButton } from "@erbium/ui/components/calendar";
import type { DateRange } from "@erbium/ui/components/calendar";
import { Card } from "@erbium/ui/components/card";
import { addDays } from "@erbium/ui/lib/date";

const isPeak = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

/** Day button that marks weekend nights, which are billed at the peak rate. */
const RateDayButton = ({
  children,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof CalendarDayButton>) => (
  <CalendarDayButton day={day} modifiers={modifiers} {...props}>
    {children}
    {!modifiers.outside && isPeak(day.date) && (
      <>
        <span aria-hidden className="absolute end-1 top-1 size-1 rounded-full bg-current" />
        <span className="sr-only">, peak rate</span>
      </>
    )}
  </CalendarDayButton>
);

export const CalendarCustomDays = () => {
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date(new Date().getFullYear(), 11, 8);

    return { from, to: addDays(from, 10) };
  });

  return (
    <Card className="mx-auto w-fit p-0">
      <Calendar
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        components={{ DayButton: RateDayButton }}
      />
    </Card>
  );
};
