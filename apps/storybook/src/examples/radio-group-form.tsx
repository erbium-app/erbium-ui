import { Field, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import { useState } from "react";

export default function RadioGroupForm() {
  const [submitted, setSubmitted] = useState<string>();

  return (
    <form
      className="flex w-72 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        setSubmitted(JSON.stringify(data, null, 2));
      }}
    >
      <RadioGroup name="shipping" required>
        <Field orientation="horizontal">
          <RadioGroupItem value="standard" id="form-standard" />
          <FieldLabel htmlFor="form-standard">Standard (5–7 days)</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="express" id="form-express" />
          <FieldLabel htmlFor="form-express">Express (1–2 days)</FieldLabel>
        </Field>
      </RadioGroup>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
