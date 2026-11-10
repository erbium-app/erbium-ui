import { Schema } from "effect";
import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";

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
    <Form form={form} className="mx-auto w-full max-w-sm">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to{" "}
            <span className="font-medium text-foreground">m@example.com</span>.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                form.reset();
              }}
            >
              <Icon name="refresh-cw" />
              Resend
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form.AppField name="code" validators={{ onChange: DemoCode, onSubmit: CompleteCode }}>
            {(field) => (
              <field.Field>
                <FieldLabel>Verification code</FieldLabel>
                <field.OTPField
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
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
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
          <p className="text-center text-caption text-muted-foreground">
            Having trouble signing in?{" "}
            <a
              href="mailto:support@example.com"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Contact support
            </a>
          </p>
        </CardFooter>
      </Card>
    </Form>
  );
};
