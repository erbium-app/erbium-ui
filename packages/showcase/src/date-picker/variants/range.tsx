import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function DatePickerRangeExample() {
  return (
    <Field className="w-80">
      <FieldLabel htmlFor="date-picker-range">Stay</FieldLabel>
      <DatePicker mode="range">
        <DatePickerInput id="date-picker-range" />
        <DatePickerContent>
          <DatePickerCalendar numberOfMonths={2} />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
}
