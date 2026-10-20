import * as React from "react";

import { Calendar } from "@erbium/ui/components/calendar";
import { Card } from "@erbium/ui/components/card";

export const CalendarWeekNumbers = () => {
  const [date, setDate] = React.useState<Date | undefined>(
    () => new Date(new Date().getFullYear(), 0, 12),
  );

  return (
    <Card className="mx-auto w-fit p-0">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        showWeekNumber
      />
    </Card>
  );
};
