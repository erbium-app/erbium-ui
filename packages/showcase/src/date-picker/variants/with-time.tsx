import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

const Example = () => (
  <FieldGroup className="w-96 flex-row">
    <Field>
      <FieldLabel htmlFor="date-picker-time-date">Date</FieldLabel>
      <DatePicker>
        <DatePickerInput id="date-picker-time-date" />
        <DatePickerContent>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePicker>
    </Field>
    <Field className="w-32">
      <FieldLabel htmlFor="date-picker-time-time">Time</FieldLabel>
      <Input
        id="date-picker-time-time"
        type="time"
        step="60"
        defaultValue="10:30"
        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
      />
    </Field>
  </FieldGroup>
);

export default Example;
