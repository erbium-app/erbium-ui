import { HugeiconsIcon } from "@hugeicons/react";
import RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";
import { REGEXP_ONLY_DIGITS } from "input-otp";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@erbium/ui/components/input-otp";

export function InputOTPForm() {
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
            <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
            <InputOTP id="otp-verification" maxLength={6} pattern={REGEXP_ONLY_DIGITS} required>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
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
