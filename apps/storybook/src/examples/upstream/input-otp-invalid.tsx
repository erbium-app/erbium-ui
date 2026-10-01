import * as React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { FieldError } from "@erbium/ui/components/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@erbium/ui/components/input-otp";
import { shake } from "@erbium/ui/lib/shake";

export function InputOTPInvalid() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "invalid" | "verified">("idle");
  const errorId = React.useId();
  const shakeRef = React.useRef<HTMLDivElement>(null);
  const invalid = status === "invalid";

  function handleChange(nextValue: string) {
    setValue(nextValue);

    if (nextValue.length < 6) {
      setStatus("idle");
    } else if (nextValue === "123456") {
      setStatus("verified");
    } else {
      setStatus("invalid");
      shake(shakeRef.current);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Demo code: 123456</p>
      <div ref={shakeRef} className="w-fit">
        <InputOTP
          aria-describedby={errorId}
          aria-invalid={invalid}
          aria-label="Verification code"
          maxLength={6}
          onChange={handleChange}
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid={invalid} />
            <InputOTPSlot index={1} aria-invalid={invalid} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} aria-invalid={invalid} />
            <InputOTPSlot index={3} aria-invalid={invalid} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} aria-invalid={invalid} />
            <InputOTPSlot index={5} aria-invalid={invalid} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <FieldError id={errorId} errors={invalid ? ["Incorrect code. Try 123456."] : []} />
      {status === "verified" && <p role="status">Code verified.</p>}
    </div>
  );
}
