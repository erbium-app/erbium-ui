import { OTPField } from "@erbium/ui/components/otp-field";

const OTPFieldWithSeparator = () => (
  <OTPField aria-label="One-time password" length={6} groups={[2, 2, 2]} />
);

export default OTPFieldWithSeparator;
