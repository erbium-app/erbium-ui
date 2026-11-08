import { Calendar } from "@erbium/ui/components/calendar";

export const CalendarCaption = () => (
  <Calendar
    mode="single"
    captionLayout="dropdown"
    startMonth={new Date(1950, 0)}
    endMonth={new Date(2050, 11)}
  />
);
