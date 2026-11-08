import * as React from "react";

import { Button } from "@erbium/ui/components/button";
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";

const Example = () => {
  const [submitted, setSubmitted] = React.useState("");

  return (
    <form
      className="flex w-80 flex-col gap-group"
      onSubmit={(event) => {
        event.preventDefault();
        const entries = [...new FormData(event.currentTarget)];

        setSubmitted(
          entries
            .map(([key, value]) => `${key}=${value instanceof File ? value.name : value}`)
            .join("&"),
        );
      }}
    >
      <Field>
        <FieldLabel htmlFor="date-picker-form-trip">Trip</FieldLabel>
        <DatePicker mode="range" name="trip">
          <DatePickerInput id="date-picker-form-trip" />
          <DatePickerContent>
            <DatePickerCalendar numberOfMonths={2} />
          </DatePickerContent>
        </DatePicker>
        <FieldDescription>Submitted as an ISO interval.</FieldDescription>
      </Field>
      <Button type="submit" className="self-start">
        Submit
      </Button>
      {submitted && <output className="text-caption text-muted-foreground">{submitted}</output>}
    </form>
  );
};

export default Example;
