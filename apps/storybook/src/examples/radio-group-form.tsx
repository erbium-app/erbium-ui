import { Label } from "@erbium/ui/components/label";
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
        <div className="flex items-center gap-3">
          <RadioGroupItem value="standard" id="form-standard" />
          <Label htmlFor="form-standard">Standard (5–7 days)</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="express" id="form-express" />
          <Label htmlFor="form-express">Express (1–2 days)</Label>
        </div>
      </RadioGroup>
      <StatefulButton className="self-start" type="submit">
        Submit
      </StatefulButton>
      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}
    </form>
  );
}
