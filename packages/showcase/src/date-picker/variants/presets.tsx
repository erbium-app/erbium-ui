import * as React from "react";

import { Button } from "@erbium/ui/components/button";
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Separator } from "@erbium/ui/components/separator";
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
        <DatePickerContent className="flex-row gap-group max-sm:flex-col-reverse">
          <div className="flex flex-col gap-0.5">
            {presets.map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="xs"
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
          <Separator orientation="vertical" className="max-sm:hidden" />
          <Separator className="sm:hidden" />
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
};

export default Example;
