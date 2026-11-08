import { Calendar } from "@erbium/ui/components/calendar";

const Example = (args: {
  showOutsideDays: boolean;
  showWeekNumber: boolean;
  fixedWeeks: boolean;
  numberOfMonths: number;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
}) => (
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

export default Example;
