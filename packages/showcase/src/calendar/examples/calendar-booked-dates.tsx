import * as React from "react";

import { Calendar } from "@erbium/ui/components/calendar";
import { Card } from "@erbium/ui/components/card";

export function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    () => new Date(new Date().getFullYear(), 0, 6),
  );

  const [bookedDates] = React.useState(() => {
    const year = new Date().getFullYear();

    return Array.from({ length: 15 }, (_, i) => new Date(year, 0, 12 + i));
  });

  return (
    <Card className="mx-auto w-fit p-0">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        disabled={bookedDates}
        modifiers={{
          booked: bookedDates,
        }}
        modifiersClassNames={{
          booked: "[&>button]:line-through opacity-100",
        }}
      />
    </Card>
  );
}
