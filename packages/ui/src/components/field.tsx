import { useMemo, useState } from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Separator } from "./separator";

function FieldSet({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldsetPrimitive.Legend.Props & { variant?: "legend" | "label" }) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva("group/field flex w-full gap-2 data-invalid:text-error", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/**
 * Base UI `Field.Root`: wires the label, description, error and control, and
 * exposes `name`, `invalid`, `dirty`, `touched` and `disabled`. Controlled form
 * libraries pass their own state, e.g. TanStack Form:
 * `invalid={!field.state.meta.isValid}`.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: FieldPrimitive.Root.Props & VariantProps<typeof fieldVariants>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-0.5 leading-snug", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 text-sm leading-snug font-medium select-none data-disabled:pointer-events-none data-disabled:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50 has-[>[data-slot=field]]:has-focus-visible:border-ring *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-disabled/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        "text-start text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 flex h-5 items-center text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="text-muted-foreground">
        {children && <span data-slot="field-separator-content">{children}</span>}
      </Separator>
    </div>
  );
}

type FieldErrorProps = FieldPrimitive.Error.Props & {
  /**
   * Messages from a form library, e.g. TanStack Form's `field.state.meta.errors`
   * (strings or Standard Schema issues). When set, the error shows exactly while
   * there is at least one message; otherwise Base UI's `match` rules apply.
   */
  errors?: Array<string | { message?: string } | undefined>;
};

function FieldError({ className, children, errors, match, ...props }: FieldErrorProps) {
  const messages = useMemo(
    () => [
      ...new Set(
        (errors ?? [])
          .map((error) => (typeof error === "string" ? error : error?.message))
          .filter((message): message is string => Boolean(message)),
      ),
    ],
    [errors],
  );
  const key = messages.join("\n");
  // Keep the last message mounted while Base UI plays the exit transition.
  const [shownKey, setShownKey] = useState(key);
  if (key && key !== shownKey) {
    setShownKey(key);
  }
  const shown = key || shownKey ? (key || shownKey).split("\n") : [];

  let content = children;
  if (errors) {
    content =
      shown.length > 1 ? (
        <ul className="ms-4 flex list-disc flex-col gap-1">
          {shown.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : (
        shown[0]
      );
  }

  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      role="alert"
      match={errors ? messages.length > 0 : match}
      className={cn(
        "grid text-sm font-normal text-error transition-[grid-template-rows,opacity] duration-200 ease-out data-ending-style:grid-rows-[0fr] data-ending-style:opacity-0 data-starting-style:grid-rows-[0fr] data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">{content}</div>
    </FieldPrimitive.Error>
  );
}

const FieldItem = FieldPrimitive.Item;
const FieldControl = FieldPrimitive.Control;
const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  FieldItem,
  FieldControl,
  FieldValidity,
};
