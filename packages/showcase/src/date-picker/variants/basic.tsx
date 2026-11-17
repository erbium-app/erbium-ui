import * as React from "react";

import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";

export default function DatePickerBasicExample() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="flex w-64 flex-col gap-related">
      <DatePicker value={date} onValueChange={setDate}>
        <DatePickerInput aria-label="Due date" />
        <DatePickerContent>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
      <p className="text-caption text-muted-foreground">
        {date ? `Due ${date.toDateString()}` : "No date selected"}
      </p>
    </div>
  );
}
