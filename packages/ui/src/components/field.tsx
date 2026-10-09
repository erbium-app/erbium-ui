import { useMemo, useState } from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Separator } from "./separator";

/**
 * Base UI's grouped-field pattern: a `Field.Root` rendered as the `<fieldset>`.
 * The legend names the group, and a `FieldDescription`, `FieldError` or
 * `FieldItem` directly inside it wires to the group's control, e.g. a radio or
 * checkbox group.
 */
function FieldSet({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      render={<FieldsetPrimitive.Root />}
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-group has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
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
        "mb-1.5 font-medium data-[variant=label]:text-control data-[variant=legend]:text-body",
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
        "group/field-group @container/field-group flex w-full flex-col gap-group data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-group",
        className,
      )}
      {...props}
    />
  );
}

/*
 * The card variant is a selectable surface-frame: flat, hairline-framed and
 * translucent, so it reads on the canvas, a panel, a popover or a dialog. The
 * rim and tint come from state: hover and a checked control (switch, checkbox,
 * radio) tint it, focus and validity color the rim. The label stretches over
 * the card, so the whole card toggles its control.
 */
const fieldVariants = cva("group/field flex w-full gap-related data-invalid:text-error", {
  variants: {
    variant: {
      default: "",
      card: "group/field-card relative rounded-lg border surface-frame p-2.5 transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none not-data-disabled:not-has-data-checked:hover:[--surface-tint:var(--surface-tint-hover)] has-data-checked:[--surface-rim:color-mix(in_srgb,var(--selection)_30%,transparent)] has-data-checked:[--surface-tint:var(--surface-tint-selected)] has-focus-visible:[--surface-rim:var(--ring)] data-invalid:[--surface-rim:var(--error)]",
    },
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
    variant: "default",
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
  variant = "default",
  ...props
}: FieldPrimitive.Root.Props & VariantProps<typeof fieldVariants>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation}
      data-variant={variant}
      className={cn(fieldVariants({ orientation, variant }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-0.5 ", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-related text-control select-none data-disabled:pointer-events-none data-disabled:opacity-50 group-data-[variant=card]/field:w-full group-data-[variant=card]/field:after:absolute group-data-[variant=card]/field:after:inset-0",
        className,
      )}
      {...props}
    />
  );
}

/** Helper information is replaced by the error while the field is invalid. */
function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Validity>
      {({ validity }) =>
        validity.valid === false ? null : (
          <FieldPrimitive.Description
            data-slot="field-description"
            className={cn(
              "text-start text-caption font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
              "last:mt-0 nth-last-2:-mt-1",
              "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link",
              className,
            )}
            {...props}
          />
        )
      }
    </FieldPrimitive.Validity>
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
        "relative -my-2 flex h-5 items-center text-caption group-data-[variant=outline]/field-group:-mb-2",
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
        "grid text-caption font-normal text-error transition-[grid-template-rows,opacity] duration-200 ease-out data-ending-style:hidden data-starting-style:grid-rows-[0fr] data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">{content}</div>
    </FieldPrimitive.Error>
  );
}

/**
 * Base UI `Field.Item`: one checkbox or radio inside a group, with its own
 * label, description and disabled scope. Takes the same layout props as `Field`,
 * so `variant="card"` turns each item into a choice card.
 */
function FieldItem({
  className,
  orientation = "vertical",
  variant = "default",
  ...props
}: FieldPrimitive.Item.Props & VariantProps<typeof fieldVariants>) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      data-orientation={orientation}
      data-variant={variant}
      className={cn(fieldVariants({ orientation, variant }), className)}
      {...props}
    />
  );
}
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
  FieldItem,
  FieldControl,
  FieldValidity,
};
