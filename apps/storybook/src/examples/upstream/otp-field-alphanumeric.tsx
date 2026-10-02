import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldAlphanumeric() {
  return (
    <OTPField
      aria-label="Recovery code"
      length={6}
      groups={[3, 3]}
      validationType="alphanumeric"
      normalizeValue={(value) => value.toUpperCase()}
    />
  );
}
