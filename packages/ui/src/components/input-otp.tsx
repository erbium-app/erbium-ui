import * as React from "react";
import { cn } from "../lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { Separator } from "./separator";

type InputOTPStatus = "idle" | "loading" | "success" | "error";

const InputOTPStatusContext = React.createContext<InputOTPStatus>("idle");

function InputOTP({
  className,
  containerClassName,
  status = "idle",
  readOnly,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
  /**
   * Visual and semantic state. `loading` and `success` lock the field with
   * `readOnly` (not `disabled`) so the input keeps focus and its value.
   */
  status?: InputOTPStatus;
}) {
  const resolved: InputOTPStatus =
    status === "idle" && (ariaInvalid === true || ariaInvalid === "true") ? "error" : status;

  return (
    <InputOTPStatusContext value={resolved}>
      <OTPInput
        data-slot="input-otp"
        data-status={resolved === "idle" ? undefined : resolved}
        aria-invalid={resolved === "error" ? true : ariaInvalid}
        aria-busy={resolved === "loading" || undefined}
        readOnly={readOnly || resolved === "loading" || resolved === "success"}
        containerClassName={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          containerClassName,
        )}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPStatusContext>
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
  const status = React.useContext(InputOTPStatusContext);
  const locked = status === "loading" || status === "success";

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive && !locked}
      data-status={status === "idle" ? undefined : status}
      aria-invalid={status === "error" || undefined}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-lg border surface-field text-sm transition-all outline-none aria-invalid:border-error data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[1.5px] data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-error data-[active=true]:aria-invalid:ring-0 dark:aria-invalid:border-error/50 data-[status=success]:border-success data-[status=success]:text-success-soft-foreground data-[status=loading]:text-muted-foreground motion-safe:data-[status=loading]:animate-pulse",
        className,
      )}
      {...props}
    >
      {status === "loading" ? (
        <span className="shimmer [--shimmer-color:color-mix(in_oklab,currentColor_35%,transparent)] [--shimmer-spread:1.5ch]">
          {char}
        </span>
      ) : (
        char
      )}
      {hasFakeCaret && !locked && (
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

export type { InputOTPStatus };
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
