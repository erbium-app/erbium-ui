import { Field, FieldLabel } from "@erbium/ui/components/field";
import { OTPField } from "@erbium/ui/components/otp-field";

export default function OTPFieldPatternExample() {
  return (
    <Field className="w-fit">
      <FieldLabel>Digits Only</FieldLabel>
      <OTPField length={6} validationType="numeric" />
    </Field>
  );
}
