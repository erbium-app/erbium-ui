import { useId } from "react";
import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldForm() {
  const formId = useId();
  const form = useForm({
    defaultValues: { code: "" },
    onSubmit: () => undefined,
  });
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to{" "}
          <span className="font-medium text-foreground">m@example.com</span>.
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="xs" onClick={() => form.reset()}>
            <HugeiconsIcon icon={RefreshCwIcon} />
            Resend
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          id={formId}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="code"
            validators={{
              onChange: ({ value }) =>
                value.length === 6 && value !== "123456"
                  ? "Incorrect code. Try 123456."
                  : undefined,
              onSubmit: ({ value }) => (value.length !== 6 ? "Enter all 6 digits." : undefined),
            }}
          >
            {(field) => (
              <Field
                name={field.name}
                invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                touched={field.state.meta.isTouched}
                dirty={field.state.meta.isDirty}
              >
                <FieldLabel>Verification code</FieldLabel>
                <OTPField
                  length={6}
                  groups={[3, 3]}
                  required
                  value={field.state.value}
                  validation={field.state.meta}
                  verifiedValue={
                    form.state.isSubmitted && field.state.meta.isValid
                      ? field.state.value
                      : undefined
                  }
                  onValueChange={field.handleChange}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) field.handleBlur();
                  }}
                />
                <FieldDescription>Demo code: 123456</FieldDescription>
                <FieldError errors={field.state.meta.isTouched ? field.state.meta.errors : []} />
              </Field>
            )}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isSubmitted && state.isValid && state.values.code.length === 6,
          ]}
        >
          {([canSubmit, isSubmitting, isSubmitted]) => (
            <>
              <Button type="submit" form={formId} disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Verifying…" : "Verify"}
              </Button>
              {isSubmitted && (
                <p role="status" className="text-sm text-success-soft-foreground">
                  Code verified.
                </p>
              )}
            </>
          )}
        </form.Subscribe>
        <p className="text-center text-sm text-muted-foreground">
          Having trouble signing in?{" "}
          <a
            href="#"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Contact support
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
