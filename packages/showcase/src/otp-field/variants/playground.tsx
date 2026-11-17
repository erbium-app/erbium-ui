import { OTPField } from "@erbium/ui/components/otp-field";

export const defaultProps = {
  disabled: false,
  isValidating: false,
  length: 6,
  validationType: "numeric",
} satisfies {
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  isValidating: boolean;
};

export default function OtpFieldPlaygroundExample(
  args: {
    length: number;
    disabled: boolean;
    validationType: "numeric" | "alphanumeric" | "none";
    isValidating: boolean;
  } = defaultProps,
) {
  return (
    <OTPField
      key={`${args.length}-${args.validationType}`}
      aria-label="One-time password"
      length={args.length}
      disabled={args.disabled}
      value={args.isValidating ? "12345678".slice(0, args.length) : undefined}
      validationType={args.validationType}
      validation={{
        isDirty: false,
        isTouched: false,
        isValid: true,
        isValidating: args.isValidating,
      }}
    />
  );
}
