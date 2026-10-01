import * as React from "react";
import { cn } from "../lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { Separator } from "./separator";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-lg border surface-field text-sm transition-all outline-none aria-invalid:border-error data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[1.5px] data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-error data-[active=true]:aria-invalid:ring-0 dark:aria-invalid:border-error/50",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="input-otp-separator"
      orientation="horizontal"
      variant="full"
      className={cn("rounded-full data-horizontal:w-3 data-horizontal:self-auto", className)}
      {...props}
    />
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
