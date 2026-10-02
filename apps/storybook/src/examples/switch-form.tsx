import { Field, FieldLabel } from "@erbium/ui/components/field";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import { Switch } from "@erbium/ui/components/switch";
import { useState } from "react";

export default function SwitchForm() {
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
      <Field orientation="horizontal">
        <Switch name="newsletter" value="yes" uncheckedValue="no" />
        <FieldLabel>Subscribe to the newsletter</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch name="terms" required />
        <FieldLabel>Accept the terms (required)</FieldLabel>
      </Field>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
