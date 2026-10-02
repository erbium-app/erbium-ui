// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";
import { shake } from "../lib/shake";
import { StatefulButton } from "../components/stateful-button";
import { useRef, useState } from "react";

export default function CheckboxForm() {
  const [submitted, setSubmitted] = useState<string>();
  const [termsInvalid, setTermsInvalid] = useState(false);
  const termsInputRef = useRef<HTMLInputElement>(null);
  const termsRowRef = useRef<HTMLDivElement>(null);

  return (
    <form
      className="flex w-72 flex-col gap-4"
      onInvalid={(event) => {
        if (event.target === termsInputRef.current) {
          setTermsInvalid(true);
          shake(termsRowRef.current);
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        setSubmitted(JSON.stringify(data, null, 2));
      }}
    >
      <Field ref={termsRowRef} orientation="horizontal" invalid={termsInvalid}>
        <Checkbox
          name="terms"
          required
          inputRef={termsInputRef}
          onCheckedChange={(checked) => {
            if (checked) {
              setTermsInvalid(false);
            }
          }}
        />
        <FieldLabel>Accept terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox name="newsletter" value="weekly" uncheckedValue="none" />
        <FieldLabel>Weekly newsletter</FieldLabel>
      </Field>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
