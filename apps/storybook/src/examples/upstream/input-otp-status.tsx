import * as React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPStatus,
} from "@erbium/ui/components/input-otp";
import { shake } from "@erbium/ui/lib/shake";

const VERIFY_DELAY = 900;

const STATUS_MESSAGE: Record<InputOTPStatus, string> = {
  idle: "",
  loading: "Verifying code",
  success: "Code verified.",
  error: "Incorrect code. Try 123456.",
};

export function InputOTPStatusDemo() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<InputOTPStatus>("idle");
  const errorId = React.useId();
  const shakeRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(nextValue: string) {
    setValue(nextValue);
    clearTimeout(timer.current);
    setStatus("idle");
  }

  function handleComplete(code: string) {
    setStatus("loading");
    timer.current = setTimeout(() => {
      if (code === "123456") {
        setStatus("success");
        return;
      }
      setStatus("error");
      shake(shakeRef.current);
    }, VERIFY_DELAY);
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
          onComplete={handleComplete}
          pattern={REGEXP_ONLY_DIGITS}
          status={status}
          value={value}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p id={errorId} role="status" className="sr-only">
        {STATUS_MESSAGE[status]}
      </p>
    </div>
  );
}
