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
import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldForm() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to{" "}
          <span className="font-medium text-foreground">m@example.com</span>.
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="xs">
            <HugeiconsIcon icon={RefreshCwIcon} />
            Resend
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="otp-verification-form" onSubmit={(event) => event.preventDefault()}>
          <Field>
            <FieldLabel>Verification code</FieldLabel>
            <OTPField length={6} groups={[3, 3]} required />
            <FieldDescription>
              <a href="#">I no longer have access to this email address.</a>
            </FieldDescription>
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Button type="submit" form="otp-verification-form">
          Verify
        </Button>
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
