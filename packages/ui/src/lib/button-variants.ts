import { cva } from "class-variance-authority";

/* Each variant names one surface; hover, press, engaged, invalid, and
   disabled states come from the surface itself. */
const buttonVariants = cva(
  "group/button touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-control whitespace-nowrap transition-button duration-150 outline-none select-none [--button-shortcut-inset:0.125rem] focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-control aria-invalid:ring-invalid-halo motion-reduce:transition-none dark:aria-invalid:border-invalid data-disabled:pointer-events-none data-disabled:opacity-50 data-[loading]:data-disabled:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>[data-slot=spinner]]:order-first",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "control-size text-control-sm [&_svg:not([class*='size-'])]:size-control-icon",
        icon: "size-control [&_svg:not([class*='size-'])]:size-control-icon",
        "icon-lg": "size-control-lg [&_svg:not([class*='size-'])]:size-control-icon-lg",
        "icon-sm":
          "size-control-sm rounded-button-sm [&_svg:not([class*='size-'])]:size-control-icon-sm",
        "icon-xs":
          "size-control-xs rounded-button-xs [&_svg:not([class*='size-'])]:size-control-icon-sm",
        lg: "control-size-lg text-control [&_svg:not([class*='size-'])]:size-control-icon-lg",
        sm: "control-size-sm rounded-button-sm text-control-sm [&_svg:not([class*='size-'])]:size-control-icon-sm",
        xs: "control-size-xs rounded-button-xs text-control-sm [&_svg:not([class*='size-'])]:size-control-icon-sm",
      },
      variant: {
        default: "surface-fill-primary text-primary-foreground",
        error: "surface-fill-error text-error-foreground focus-visible:border-error-focus",
        embedded:
          "border-0 bg-transparent text-muted-foreground shadow-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring active:text-foreground",
        ghost: "surface-flat hover:text-foreground engaged:text-foreground",
        "ghost-error":
          "surface-ghost-error-soft text-error-soft-foreground focus-visible:border-error-focus",
        "ghost-info":
          "surface-ghost-info-soft text-info-soft-foreground focus-visible:border-info-focus",
        "ghost-success":
          "surface-ghost-success-soft text-success-soft-foreground focus-visible:border-success-focus",
        "ghost-warning":
          "surface-ghost-warning-soft text-warning-soft-foreground focus-visible:border-warning-focus",
        info: "surface-fill-info text-info-foreground focus-visible:border-info-focus",
        link: "text-link underline-offset-4 hover:underline",
        outline: "surface-control text-foreground",
        secondary: "surface-flat bg-secondary text-secondary-foreground",
        success: "surface-fill-success text-success-foreground focus-visible:border-success-focus",
        warning: "surface-fill-warning text-warning-foreground focus-visible:border-warning-focus",
      },
    },
  },
);

export { buttonVariants };
