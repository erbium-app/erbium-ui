import * as React from "react";

import { Calendar, CalendarDayButton } from "@erbium/ui/components/calendar";
import type { DateRange } from "@erbium/ui/components/calendar";
import { Card } from "@erbium/ui/components/card";
import { addDays } from "@erbium/ui/lib/date";

const priceFormat = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

/** Day button with the nightly price under the date. */
const PriceDayButton = ({
  children,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof CalendarDayButton>) => {
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

  return (
    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
      {children}
      {!modifiers.outside && (
        <span className="text-metadata opacity-70">
          {priceFormat.format(isWeekend ? 120 : 100)}
        </span>
      )}
    </CalendarDayButton>
  );
};

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
        className="[--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
        classNames={{ day_button: "flex-col gap-0" }}
        components={{ DayButton: PriceDayButton }}
      />
    </Card>
  );
};
