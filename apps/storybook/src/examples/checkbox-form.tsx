import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { shake } from "@erbium/ui/lib/shake";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import { useId, useRef, useState } from "react";

export default function CheckboxForm() {
  const [submitted, setSubmitted] = useState<string>();
  const [termsInvalid, setTermsInvalid] = useState(false);
  const termsInputRef = useRef<HTMLInputElement>(null);
  const termsRowRef = useRef<HTMLDivElement>(null);
  const termsId = useId();
  const newsletterId = useId();

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
      <Field ref={termsRowRef} orientation="horizontal" data-invalid={termsInvalid}>
        <Checkbox
          id={termsId}
          name="terms"
          required
          inputRef={termsInputRef}
          aria-invalid={termsInvalid}
          onCheckedChange={(checked) => {
            if (checked) {
              setTermsInvalid(false);
            }
          }}
        />
        <FieldLabel htmlFor={termsId}>Accept terms and conditions</FieldLabel>
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id={newsletterId} name="newsletter" value="weekly" uncheckedValue="none" />
        <FieldLabel htmlFor={newsletterId}>Weekly newsletter</FieldLabel>
      </div>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
