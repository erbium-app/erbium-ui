import { de } from "@daypicker/react/locale";

import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function DatePickerLocalizedExample() {
  return (
    <Field className="w-64">
      <FieldLabel htmlFor="date-picker-localized">Liefertermin</FieldLabel>
      <DatePicker locale="de-DE">
        <DatePickerInput
          id="date-picker-localized"
          placeholder="Datum wählen"
          triggerLabel="Datum auswählen"
        />
        <DatePickerContent>
          <DatePickerCalendar locale={de} />
        </DatePickerContent>
      </DatePicker>
    </Field>
  );
}
