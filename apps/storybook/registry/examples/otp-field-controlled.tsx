// @ts-nocheck
import * as React from "react";

import { OTPField } from "../components/otp-field";

export default function OTPFieldControlled() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-2">
      <OTPField aria-label="One-time password" length={6} value={value} onValueChange={setValue} />
      <div className="text-center text-sm">
        {value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}
      </div>
    </div>
  );
}
