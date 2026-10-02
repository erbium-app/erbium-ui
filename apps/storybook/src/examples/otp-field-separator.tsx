import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldWithSeparator() {
  return <OTPField aria-label="One-time password" length={6} groups={[2, 2, 2]} />;
}
