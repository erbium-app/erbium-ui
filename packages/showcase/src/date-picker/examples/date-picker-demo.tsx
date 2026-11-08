import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";

const DatePickerDemo = () => (
  <Field className="w-64">
    <FieldLabel htmlFor="date-picker-demo">Start date</FieldLabel>
    <DatePicker>
      <DatePickerInput id="date-picker-demo" />
      <DatePickerContent>
        <DatePickerCalendar />
      </DatePickerContent>
    </DatePicker>
    <FieldDescription>Type a date or press the down arrow to open the calendar.</FieldDescription>
  </Field>
);

export default DatePickerDemo;
