import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { LoadingIndicator } from "./spinner";

/* Filled and outline controls share states; the surface chooses the rim. */
const interactiveSurface =
  "hover:tint-hover engaged:tint-press engaged:hover:tint-press engaged:shadow-engaged active:tint-press active:shadow-pressed engaged:active:shadow-pressed disabled:shadow-edge data-disabled:shadow-edge engaged:disabled:shadow-edge engaged:data-disabled:shadow-edge";

/* Outline buttons sit one step above their surface, like inputs. */
const controlSurface = `border-surface-border bg-surface-control text-foreground shadow-control ${interactiveSurface}`;

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none [--button-shortcut-inset:0.125rem] motion-reduce:transition-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 aria-invalid:[--surface-edge:var(--destructive)] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50 data-[loading]:data-disabled:opacity-100",
  {
    variants: {
      variant: {
        default: `surface-fill-primary text-primary-foreground ${interactiveSurface}`,
        outline: controlSurface,
        secondary:
          "bg-secondary text-secondary-foreground hover:tint-hover active:tint-press engaged:tint-press engaged:hover:tint-press",
        ghost:
          "hover:tint-hover hover:text-foreground active:tint-press engaged:tint-press engaged:hover:tint-press engaged:text-foreground",
        destructive: `surface-fill-destructive text-destructive-foreground focus-visible:border-destructive/40 ${interactiveSurface}`,
        success: `surface-fill-success text-success-foreground focus-visible:border-success/40 ${interactiveSurface}`,
        warning: `surface-fill-warning text-warning-foreground focus-visible:border-warning/40 ${interactiveSurface}`,
        info: `surface-fill-info text-info-foreground focus-visible:border-info/40 ${interactiveSurface}`,
        "ghost-destructive":
          "text-destructive-soft-foreground hover:bg-destructive-soft active:bg-destructive-soft-hover engaged:bg-destructive-soft focus-visible:border-destructive/40 ",
        "ghost-success":
          "text-success-soft-foreground hover:bg-success-soft active:bg-success-soft-hover engaged:bg-success-soft focus-visible:border-success/40 ",
        "ghost-warning":
          "text-warning-soft-foreground hover:bg-warning-soft active:bg-warning-soft-hover engaged:bg-warning-soft focus-visible:border-warning/40 ",
        "ghost-info":
          "text-info-soft-foreground hover:bg-info-soft active:bg-info-soft-hover engaged:bg-info-soft focus-visible:border-info/40 ",
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
      {...props}
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
