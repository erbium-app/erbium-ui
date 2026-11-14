import * as React from "react";

import { toISODate } from "@erbium/ui/lib/date";
import { Form, useAppForm } from "@erbium/ui/components/form";
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";

interface Trip {
  from: Date | undefined;
  to: Date | undefined;
}

const emptyTrip: Trip = {
  from: undefined,
  to: undefined,
};

const Example = () => {
  const id = React.useId();

  const form = useAppForm({
    defaultValues: {
      trip: emptyTrip,
    },
  });

  return (
    <Form form={form} className="flex w-80 flex-col gap-group">
      <form.AppField
        name="trip"
        validators={{
          onDynamic: ({ value }) =>
            value.from && value.to ? undefined : "Choose the start and end dates.",
        }}
      >
        {(field) => (
          <field.Field required>
            <FieldLabel htmlFor={id}>Trip</FieldLabel>
            <DatePicker
              mode="range"
              value={field.state.value}
              onValueChange={(value) => {
                field.handleChange({ from: value?.from, to: value?.to });
              }}
            >
              <DatePickerInput required id={id} onBlur={field.handleBlur} />
              <DatePickerContent>
                <DatePickerCalendar numberOfMonths={2} />
              </DatePickerContent>
            </DatePicker>
            <FieldDescription>Submitted as an ISO interval.</FieldDescription>
            <field.FieldError />
          </field.Field>
        )}
      </form.AppField>
      <form.SubmitButton className="self-start">Submit</form.SubmitButton>
      <form.Subscribe
        selector={(state) => (state.isSubmitSuccessful ? state.values.trip : undefined)}
      >
        {(trip) =>
          trip?.from &&
          trip.to && (
            <output className="text-caption text-muted-foreground">
              trip={toISODate(trip.from)}/{toISODate(trip.to)}
            </output>
          )
        }
      </form.Subscribe>
    </Form>
  );
};

export default Example;
