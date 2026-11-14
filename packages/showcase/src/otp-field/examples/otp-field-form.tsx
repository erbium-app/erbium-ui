import { Schema } from "effect";
import { Button } from "@erbium/ui/components/button";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { Card, CardContent, CardDescription, CardHeader } from "@erbium/ui/components/card";

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

export const OTPFieldForm = () => {
  const form = useAppForm({
    defaultValues: { code: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <h2 className="text-subtitle">Verify your sign-in</h2>
        <CardDescription>Enter the verification code sent to m@example.com.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} className="flex flex-col gap-section">
          <form.AppField name="code" validators={{ onChange: DemoCode, onSubmit: CompleteCode }}>
            {(field) => (
              <field.Field>
                <FieldLabel>Verification code</FieldLabel>
                <field.OTPField
                  className="gap-1 *:data-[slot=otp-field-group]:gap-1"
                  length={6}
                  groups={[3, 3]}
                  required
                  verifiedValue={
                    form.state.isSubmitted && field.state.meta.isValid
                      ? field.state.value
                      : undefined
                  }
                />
                <FieldDescription>Demo code: 123456</FieldDescription>
                <field.FieldError />
              </field.Field>
            )}
          </form.AppField>
          <form.SubmitButton successLabel="Verified">Verify</form.SubmitButton>
          <form.Subscribe
            selector={(state) =>
              state.isSubmitted && state.isValid && state.values.code.length === 6
            }
          >
            {(verified) =>
              verified ? (
                <output className="block text-caption text-success-soft-foreground">
                  Code verified.
                </output>
              ) : null
            }
          </form.Subscribe>
          <p className="flex flex-wrap items-center justify-center gap-1 text-caption text-muted-foreground">
            Didn’t receive a code?
            <Button
              type="button"
              variant="link"
              onClick={() => {
                form.reset();
              }}
            >
              Resend code
            </Button>
          </p>
        </Form>
      </CardContent>
    </Card>
  );
};
