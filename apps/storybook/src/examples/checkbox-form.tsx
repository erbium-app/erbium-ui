import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";
import { StatusButton } from "@erbium/ui/components/status-button";
import { useState } from "react";

export default function CheckboxForm() {
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
      <div className="flex items-center gap-2">
        <Checkbox id="form-terms" name="terms" required />
        <Label htmlFor="form-terms">Accept terms (required)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="form-newsletter" name="newsletter" value="weekly" uncheckedValue="none" />
        <Label htmlFor="form-newsletter">Weekly newsletter</Label>
      </div>
      <StatusButton className="self-start" type="submit">
        Submit
      </StatusButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
