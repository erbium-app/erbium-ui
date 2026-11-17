import { Calendar } from "@erbium/ui/components/calendar";

export default function CalendarCaptionExample() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      startMonth={new Date(1950, 0)}
      endMonth={new Date(2050, 11)}
    />
  );
}
