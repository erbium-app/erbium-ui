import * as React from "react";
import { faIR, getDateLib } from "@daypicker/persian";

import { Calendar } from "@erbium/ui/components/calendar";

// The Jalali date library drives months, weeks, and numerals; Calendar keeps
// its styling and RTL layout.
const persianDateLib = getDateLib({ locale: faIR, numerals: "arabext" });

export default function CalendarPersianExample() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      dateLib={persianDateLib}
      locale={faIR}
      numerals="arabext"
      dir="rtl"
      formatters={{
        formatWeekdayName: (weekday, _options, dateLib) =>
          (dateLib ?? persianDateLib).format(weekday, "ccccc"),
      }}
    />
  );
}
