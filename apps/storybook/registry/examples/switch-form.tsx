// @ts-nocheck
import { Label } from "../components/label";
import { StatefulButton } from "../components/stateful-button";
import { Switch } from "../components/switch";
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
      <div className="flex items-center gap-3">
        <Switch id="form-newsletter" name="newsletter" value="yes" uncheckedValue="no" />
        <Label htmlFor="form-newsletter">Subscribe to the newsletter</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="form-terms" name="terms" required />
        <Label htmlFor="form-terms">Accept the terms (required)</Label>
      </div>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
