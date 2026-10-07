import * as React from "react";

import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { OTPField, type OTPFieldStatus } from "@erbium/ui/components/otp-field";

export function OTPFieldInvalid() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<OTPFieldStatus>("idle");
  const invalid = status === "error";

  function handleValueChange(nextValue: string) {
    setValue(nextValue);
    setStatus(nextValue.length === 6 ? (nextValue === "123456" ? "success" : "error") : "idle");
  }

  return (
    <Field className="w-fit" invalid={invalid}>
      <FieldLabel>Verification code</FieldLabel>
      <p className="text-sm text-muted-foreground">Demo code: 123456</p>
      <OTPField
        groups={[2, 2, 2]}
        length={6}
        onValueChange={handleValueChange}
        status={status}
        value={value}
      />
      <FieldError errors={invalid ? ["Incorrect code. Try 123456."] : []} />
    </Field>
  );
}
