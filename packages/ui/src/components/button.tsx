import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";
import { rippleProps } from "../lib/ripple";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { LoadingIndicator } from "./spinner";

/* Each variant names one surface; hover, press, engaged, invalid, and
   disabled states come from the surface itself. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none [--button-shortcut-inset:0.125rem] motion-reduce:transition-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-error/20 dark:aria-invalid:border-error/50 dark:aria-invalid:ring-error/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50 data-[loading]:data-disabled:opacity-100",
  {
    variants: {
      variant: {
        default: "surface-fill-primary text-primary-foreground",
        outline: "surface-control text-foreground",
        secondary: "surface-flat bg-secondary text-secondary-foreground",
        ghost: "surface-flat hover:text-foreground engaged:text-foreground",
        error: "surface-fill-error text-error-foreground focus-visible:border-error/40",
        success: "surface-fill-success text-success-foreground focus-visible:border-success/40",
        warning: "surface-fill-warning text-warning-foreground focus-visible:border-warning/40",
        info: "surface-fill-info text-info-foreground focus-visible:border-info/40",
        "ghost-error":
          "surface-ghost-error-soft text-error-soft-foreground focus-visible:border-error/40",
        "ghost-success":
          "surface-ghost-success-soft text-success-soft-foreground focus-visible:border-success/40",
        "ghost-warning":
          "surface-ghost-warning-soft text-warning-soft-foreground focus-visible:border-warning/40",
        "ghost-info":
          "surface-ghost-info-soft text-info-soft-foreground focus-visible:border-info/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  loading = false,
  variant = "default",
  size = "default",
  "aria-busy": ariaBusy,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  const iconOnly = typeof size === "string" && size.startsWith("icon");

  return (
    <ButtonPrimitive
      data-slot="button"
      data-size={size}
      data-variant={variant}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || ariaBusy}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...mergeProps<typeof ButtonPrimitive>(rippleProps, props)}
    >
      {loading && <LoadingIndicator inlineStart={!iconOnly} />}
      {loading && iconOnly ? null : children}
    </ButtonPrimitive>
  );
}

function ButtonShortcut({ className, ...props }: React.ComponentProps<typeof Kbd>) {
  return (
    <span
      data-slot="button-shortcut"
      className="ms-1.5 me-[calc(-1*var(--button-shortcut-inset))] inline-flex shrink-0"
    >
      <Kbd
        aria-hidden
        className={cn(
          "group-data-[size=xs]/button:h-4 group-data-[size=xs]/button:min-w-4 group-data-[size=xs]/button:text-[10px]",
          className,
        )}
        {...props}
      />
    </span>
  );
}

export { Button, ButtonShortcut, buttonVariants };
