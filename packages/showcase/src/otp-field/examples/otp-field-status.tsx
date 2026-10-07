import * as React from "react";

import { OTPField, type OTPFieldStatus } from "@erbium/ui/components/otp-field";

const VERIFY_DELAY = 900;

export function OTPFieldStatusDemo() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<OTPFieldStatus>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  function handleValueChange(nextValue: string) {
    setValue(nextValue);
    clearTimeout(timer.current);
    if (nextValue.length !== 6) {
      setStatus("idle");
      return;
    }
    setStatus("loading");
    timer.current = setTimeout(() => {
      setStatus(nextValue === "123456" ? "success" : "error");
    }, VERIFY_DELAY);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Demo code: 123456</p>
      <OTPField
        aria-label="Verification code"
        groups={[3, 3]}
        length={6}
        onValueChange={handleValueChange}
        status={status}
        value={value}
      />
    </div>
  );
}
