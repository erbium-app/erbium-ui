import * as React from "react";

import { Calendar } from "@erbium/ui/components/calendar";
import { Card } from "@erbium/ui/components/card";

const year = new Date().getFullYear();

// Fifteen nights from January 12 are already booked.
const bookedDates = Array.from({ length: 15 }, (_, i) => new Date(year, 0, 12 + i));

export default function CalendarBookedDatesExample() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date(year, 0, 6));

  return (
    <Card className="mx-auto w-fit p-0">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        disabled={bookedDates}
      />
    </Card>
  );
}
