import { Calendar } from "@erbium/ui/components/calendar";

export const defaultProps = {
  captionLayout: "label",
  fixedWeeks: false,
  numberOfMonths: 1,
  showOutsideDays: true,
  showWeekNumber: false,
  weekStartsOn: 0,
} satisfies {
  showOutsideDays: boolean;
  showWeekNumber: boolean;
  fixedWeeks: boolean;
  numberOfMonths: number;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
};

export default function CalendarPlaygroundExample(
  args: {
    showOutsideDays: boolean;
    showWeekNumber: boolean;
    fixedWeeks: boolean;
    numberOfMonths: number;
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
  } = defaultProps,
) {
  return (
    <Calendar
      mode="single"
      showOutsideDays={args.showOutsideDays}
      showWeekNumber={args.showWeekNumber}
      fixedWeeks={args.fixedWeeks}
      numberOfMonths={args.numberOfMonths}
      weekStartsOn={args.weekStartsOn}
      captionLayout={args.captionLayout}
    />
  );
}
