// @ts-nocheck
import { Field, FieldItem, FieldLabel } from "../components/field";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { StatefulButton } from "../components/stateful-button";
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
      <Field>
        <RadioGroup name="shipping" required>
          <FieldItem orientation="horizontal">
            <RadioGroupItem value="standard" />
            <FieldLabel>Standard (5–7 days)</FieldLabel>
          </FieldItem>
          <FieldItem orientation="horizontal">
            <RadioGroupItem value="express" />
            <FieldLabel>Express (1–2 days)</FieldLabel>
          </FieldItem>
        </RadioGroup>
      </Field>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
