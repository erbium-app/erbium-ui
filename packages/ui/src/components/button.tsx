import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* Solid colour buttons: a glossy top edge, and pushed in while pressed or
   while their popup is open. */
const fillSurface =
  "shadow-fill hover:tint-hover active:tint-press active:shadow-pressed aria-expanded:tint-press aria-expanded:shadow-pressed disabled:shadow-edge data-disabled:shadow-edge";

/* Outline buttons sit one step above their surface, like inputs. */
const controlSurface =
  "bg-surface-control text-foreground shadow-control hover:tint-hover active:tint-press active:shadow-pressed aria-expanded:tint-press aria-expanded:shadow-pressed disabled:shadow-edge data-disabled:shadow-edge";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow,translate] duration-150 outline-none select-none motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:[--surface-edge:var(--destructive)] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground ${fillSurface}`,
        outline: controlSurface,
        secondary:
          "bg-secondary text-secondary-foreground hover:tint-hover active:tint-press aria-expanded:tint-press",
        ghost:
          "hover:tint-hover hover:text-foreground active:tint-press aria-expanded:tint-press aria-expanded:text-foreground",
        destructive: `bg-destructive text-destructive-foreground focus-visible:border-destructive/40 focus-visible:ring-destructive/20 ${fillSurface}`,
        success: `bg-success text-success-foreground focus-visible:border-success/40 focus-visible:ring-success/20 ${fillSurface}`,
        warning: `bg-warning text-warning-foreground focus-visible:border-warning/40 focus-visible:ring-warning/20 ${fillSurface}`,
        info: `bg-info text-info-foreground focus-visible:border-info/40 focus-visible:ring-info/20 ${fillSurface}`,
        "ghost-destructive":
          "text-destructive-soft-foreground hover:bg-destructive-soft active:bg-destructive-soft-hover aria-expanded:bg-destructive-soft focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        "ghost-success":
          "text-success-soft-foreground hover:bg-success-soft active:bg-success-soft-hover aria-expanded:bg-success-soft focus-visible:border-success/40 focus-visible:ring-success/20",
        "ghost-warning":
          "text-warning-soft-foreground hover:bg-warning-soft active:bg-warning-soft-hover aria-expanded:bg-warning-soft focus-visible:border-warning/40 focus-visible:ring-warning/20",
        "ghost-info":
          "text-info-soft-foreground hover:bg-info-soft active:bg-info-soft-hover aria-expanded:bg-info-soft focus-visible:border-info/40 focus-visible:ring-info/20",
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
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
