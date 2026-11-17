import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function DatePickerDisabledExample() {
  return (
    <Field className="w-64" disabled>
      <FieldLabel htmlFor="date-picker-disabled">Start date</FieldLabel>
      <DatePicker disabled defaultValue={new Date(2026, 0, 12)}>
        <DatePickerInput id="date-picker-disabled" />
        <DatePickerContent>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
}
