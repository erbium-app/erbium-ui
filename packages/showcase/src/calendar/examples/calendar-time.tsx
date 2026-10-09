import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Clock02Icon from "@hugeicons/core-free-icons/Clock02Icon";

import { Calendar } from "@erbium/ui/components/calendar";
import { Card, CardContent, CardFooter } from "@erbium/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

export function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} className="p-0" />
      </CardContent>
      <CardFooter>
        <FieldGroup>
          <Field>
            <FieldLabel>Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <HugeiconsIcon icon={Clock02Icon} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel>End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <HugeiconsIcon icon={Clock02Icon} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
