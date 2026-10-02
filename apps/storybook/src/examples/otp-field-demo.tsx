import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldDemo() {
  return <OTPField aria-label="One-time password" length={6} groups={[3, 3]} />;
}
