import { OTPField } from "@erbium/ui/components/otp-field";

const Example = (args: {
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  status: "idle" | "loading" | "success" | "error";
}) => (
  <OTPField
    key={`${args.length}-${args.validationType}`}
    aria-label="One-time password"
    length={args.length}
    disabled={args.disabled}
    validationType={args.validationType}
    status={args.status}
  />
);

export default Example;
