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
          aria-label="Verification code"
          maxLength={6}
          onChange={handleChange}
          pattern={REGEXP_ONLY_DIGITS}
          status={invalid ? "error" : "idle"}
          value={value}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <FieldError id={errorId} errors={invalid ? ["Incorrect code. Try 123456."] : []} />
      {status === "verified" && <p role="status">Code verified.</p>}
    </div>
  );
}
