import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldExample() {
  return <OTPField aria-label="One-time password" length={6} groups={[3, 3]} />;
}
