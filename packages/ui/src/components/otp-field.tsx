import * as React from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { cn } from "../lib/utils";
import { shake } from "../lib/shake";
import { Separator } from "./separator";

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
  /**
   * Verification state. `error` marks every slot invalid and shakes the field;
   * `loading` and `success` lock it read-only so the value stays focusable and
   * selectable. Base UI only knows `invalid` (via `Field.Root`), so the rest
   * lives here.
   */
  status?: OTPFieldStatus;
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
  status = "idle",
  ...props
}: OTPFieldProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const locked = status === "loading" || status === "success";

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
        readOnly={readOnly || locked}
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

function OTPFieldInput({ className, ...props }: OTPFieldPrimitive.Input.Props) {
  const status = React.useContext(OTPFieldStatusContext);

  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      data-status={status === "idle" ? undefined : status}
      aria-invalid={status === "error" || undefined}
      spellCheck={false}
      className={cn(
        "relative size-8 min-w-0 rounded-lg border surface-field text-center text-sm outline-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-focus-halo-strong motion-reduce:transition-none aria-invalid:border-error focus-visible:aria-invalid:ring-0 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-invalid data-[status=success]:border-success data-[status=success]:text-success-soft-foreground data-[status=loading]:text-muted-foreground motion-safe:data-[status=loading]:animate-pulse data-[status=loading]:focus-visible:ring-0 data-[status=success]:focus-visible:ring-0",
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

export type { OTPFieldProps, OTPFieldStatus };
export { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator };
