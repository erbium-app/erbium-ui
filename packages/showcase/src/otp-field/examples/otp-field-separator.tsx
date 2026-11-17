import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldWithSeparatorExample() {
  return <OTPField aria-label="One-time password" length={6} groups={[2, 2, 2]} />;
}
