import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerTrigger,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function DatePickerTriggerExample() {
  return (
    <Field className="w-56">
      <FieldLabel htmlFor="date-picker-trigger">Publish on</FieldLabel>
      <DatePicker formatOptions={{ dateStyle: "long" }}>
        <DatePickerTrigger id="date-picker-trigger" className="w-full" />
        <DatePickerContent>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
}
