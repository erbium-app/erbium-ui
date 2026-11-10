import { Schema } from "effect";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { useAppForm } from "@erbium/ui/components/form";

/** Checked on every change: a complete code must be the demo code. */
const DemoCode = Schema.toStandardSchemaV1(
  Schema.String.check(
    Schema.makeFilter((code) =>
      code.length < 6 || code === "123456" ? undefined : "Incorrect code. Try 123456.",
    ),
  ),
);

/** Checked on submit: every digit is required. */
const CompleteCode = Schema.toStandardSchemaV1(
  Schema.String.check(Schema.isMinLength(6, { message: "Enter all 6 digits." })),
);

export const OTPFieldInvalid = () => {
  const form = useAppForm({ defaultValues: { code: "" } });

  return (
    <form.AppField name="code" validators={{ onChange: DemoCode, onSubmit: CompleteCode }}>
      {(field) => (
        <field.Field className="w-fit">
          <FieldLabel>Verification code</FieldLabel>
          <FieldDescription>Demo code: 123456</FieldDescription>
          <field.OTPField
            length={6}
            groups={[3, 3]}
            verifiedValue={
              field.state.meta.isDirty && field.state.meta.isValid ? field.state.value : undefined
            }
          />
          <field.FieldError />
        </field.Field>
      )}
    </form.AppField>
  );
};
