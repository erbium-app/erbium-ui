import { Calendar } from "@erbium/ui/components/calendar";

const Example = (args: {
  showOutsideDays: boolean;
  fixedWeeks: boolean;
  numberOfMonths: number;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "error" | "link";
}) => (
  <Calendar
    mode="single"
    showOutsideDays={args.showOutsideDays}
    fixedWeeks={args.fixedWeeks}
    numberOfMonths={args.numberOfMonths}
    weekStartsOn={args.weekStartsOn}
    captionLayout={args.captionLayout}
    buttonVariant={args.buttonVariant}
  />
);

export default Example;
