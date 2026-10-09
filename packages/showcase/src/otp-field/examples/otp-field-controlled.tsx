import * as React from "react";

import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldControlled() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-2">
      <OTPField aria-label="One-time password" length={6} value={value} onValueChange={setValue} />
      <div className="text-center text-caption">
        {value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}
      </div>
    </div>
  );
}
