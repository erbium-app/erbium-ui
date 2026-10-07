import { OTPField } from "@erbium/ui/components/otp-field";

const Example = (args: {
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  isValidating: boolean;
}) => (
  <OTPField
    key={`${args.length}-${args.validationType}`}
    aria-label="One-time password"
    length={args.length}
    disabled={args.disabled}
    value={args.isValidating ? "12345678".slice(0, args.length) : undefined}
    validationType={args.validationType}
    validation={{
      isValidating: args.isValidating,
      isValid: true,
      isTouched: false,
      isDirty: false,
    }}
  />
);

export default Example;
