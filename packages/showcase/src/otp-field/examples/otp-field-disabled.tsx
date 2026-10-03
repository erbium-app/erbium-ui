import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldDisabled() {
  return (
    <OTPField aria-label="Verification code" length={6} groups={[3, 3]} disabled value="123456" />
  );
}
