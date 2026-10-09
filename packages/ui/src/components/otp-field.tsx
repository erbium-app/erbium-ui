import * as React from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { cn } from "../lib/utils";
import { shake } from "../lib/shake";
import { Separator } from "./separator";

/** Structural subset of TanStack Form's field.state.meta. */
type OTPFieldValidation = {
  isValid: boolean;
  isValidating: boolean;
  isTouched: boolean;
  isDirty: boolean;
};

type OTPFieldStatus = "idle" | "loading" | "success" | "error";

const OTPFieldStatusContext = React.createContext<OTPFieldStatus>("idle");

function OTPFieldSlots({ groups, length }: { groups?: number[]; length: number }) {
  const sizes = groups ?? [length];
  let index = 0;

  return sizes.map((size, groupIndex) => {
    const start = index;
    index += size;

    return (
      <React.Fragment key={start}>
        {groupIndex > 0 && <OTPFieldSeparator />}
        <OTPFieldGroup>
          {Array.from({ length: size }, (_, offset) => {
            const slot = start + offset;
            return (
              <OTPFieldInput
                key={slot}
                aria-label={slot === 0 ? undefined : `Character ${slot + 1} of ${length}`}
              />
            );
          })}
        </OTPFieldGroup>
      </React.Fragment>
    );
  });
}

type OTPFieldProps = OTPFieldPrimitive.Root.Props & {
  /** Validation metadata owned by the form library. Does not lock editing. */
  validation?: OTPFieldValidation;
  /** Value confirmed by verification. Valid form metadata alone does not imply success. */
  verifiedValue?: string;
  /**
   * Splits the default slots into visual groups, e.g. `[3, 3]` renders
   * `123-456`. Ignored when `children` are passed.
   */
  groups?: number[];
};

function OTPField({
  className,
  children,
  groups,
  length,
  readOnly,
  ref,
  validation,
  verifiedValue,
  value,
  ...props
}: OTPFieldProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const status: OTPFieldStatus =
    validation?.isValidating && value?.length === length
      ? "loading"
      : validation?.isTouched && !validation.isValid
        ? "error"
        : validation?.isValid && value?.length === length && value === verifiedValue
          ? "success"
          : "idle";

  React.useEffect(() => {
    if (status === "error") {
      shake(rootRef.current);
    }
  }, [status]);

  return (
    <OTPFieldStatusContext value={status}>
      <OTPFieldPrimitive.Root
        data-slot="otp-field"
        data-status={status === "idle" ? undefined : status}
        aria-busy={status === "loading" || undefined}
        length={length}
        readOnly={readOnly}
        value={value}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn("flex w-fit items-center gap-2", className)}
        {...props}
      >
        {children ?? <OTPFieldSlots groups={groups} length={length} />}
      </OTPFieldPrimitive.Root>
    </OTPFieldStatusContext>
  );
}

function OTPFieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="otp-field-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function OTPFieldInput({ className, render, ...props }: OTPFieldPrimitive.Input.Props) {
  const status = React.useContext(OTPFieldStatusContext);

  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      data-status={status === "idle" ? undefined : status}
      spellCheck={false}
      render={
        render ??
        ((inputProps, state) => (
          <span className="relative inline-flex">
            <input {...inputProps} />
            {status === "loading" && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-field text-muted-foreground"
              >
                <span className="shimmer motion-reduce:animate-none [--shimmer-color:color-mix(in_oklab,currentColor_35%,transparent)] [--shimmer-spread:1.5ch]">
                  {state.value}
                </span>
              </span>
            )}
          </span>
        ))
      }
      className={cn(
        "relative size-control control-adaptive min-w-0 rounded-lg border surface-field text-center text-field outline-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-focus-halo-strong motion-reduce:transition-none data-invalid:border-error data-[status=error]:border-error focus-visible:data-invalid:ring-0 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:data-invalid:border-invalid dark:data-[status=error]:border-invalid data-[status=success]:border-success data-[status=success]:text-success-soft-foreground data-[status=loading]:text-transparent motion-safe:data-[status=loading]:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

function OTPFieldSeparator({ className, ...props }: OTPFieldPrimitive.Separator.Props) {
  return (
    <OTPFieldPrimitive.Separator
      render={
        <Separator
          data-slot="otp-field-separator"
          orientation="horizontal"
          variant="full"
          className={cn("rounded-full data-horizontal:w-3 data-horizontal:self-auto", className)}
        />
      }
      {...props}
    />
  );
}

export type { OTPFieldProps, OTPFieldValidation };
export { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator };
