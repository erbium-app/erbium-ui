import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const today = new Date();

export default function DatePickerDateOfBirthExample() {
  return (
    <Field className="w-64">
      <FieldLabel htmlFor="date-picker-birth">Date of birth</FieldLabel>
      <DatePicker formatOptions={{ dateStyle: "long" }}>
        <DatePickerInput id="date-picker-birth" placeholder="Enter or pick a date" />
        <DatePickerContent>
          <DatePickerCalendar
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={today}
            disabled={{ after: today }}
          />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
}
