import * as React from "react";

import { Button } from "@erbium/ui/components/button";
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { addDays } from "@erbium/ui/lib/date";

const presets = [
  { days: 0, label: "Today" },
  { days: 1, label: "Tomorrow" },
  { days: 3, label: "In 3 days" },
  { days: 7, label: "In a week" },
  { days: 14, label: "In 2 weeks" },
];

const Example = () => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-64">
      <FieldLabel htmlFor="date-picker-presets">Remind me</FieldLabel>
      <DatePicker value={date} onValueChange={setDate} open={open} onOpenChange={setOpen}>
        <DatePickerInput id="date-picker-presets" />
        <DatePickerContent className="flex-row gap-0 max-sm:flex-col">
          <div className="flex flex-col gap-0.5 border-e pe-1 max-sm:order-1 max-sm:border-e-0 max-sm:border-t max-sm:pe-0 max-sm:pt-1">
            {presets.map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const today = new Date();

                  setDate(
                    addDays(
                      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                      preset.days,
                    ),
                  );
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
};

export default Example;
