import { cva } from "class-variance-authority";

/* Each variant names one surface; hover, press, engaged, invalid, and
   disabled states come from the surface itself. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-control font-medium whitespace-nowrap transition-button duration-150 outline-none select-none [--button-shortcut-inset:0.125rem] motion-reduce:transition-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-control aria-invalid:ring-invalid-halo dark:aria-invalid:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50 data-[loading]:data-disabled:opacity-100",
  {
    variants: {
      variant: {
        default: "surface-fill-primary text-primary-foreground",
        outline: "surface-control text-foreground",
        secondary: "surface-flat bg-secondary text-secondary-foreground",
        ghost: "surface-flat hover:text-foreground engaged:text-foreground",
        error: "surface-fill-error text-error-foreground focus-visible:border-error-focus",
        success: "surface-fill-success text-success-foreground focus-visible:border-success-focus",
        warning: "surface-fill-warning text-warning-foreground focus-visible:border-warning-focus",
        info: "surface-fill-info text-info-foreground focus-visible:border-info-focus",
        "ghost-error":
          "surface-ghost-error-soft text-error-soft-foreground focus-visible:border-error-focus",
        "ghost-success":
          "surface-ghost-success-soft text-success-soft-foreground focus-visible:border-success-focus",
        "ghost-warning":
          "surface-ghost-warning-soft text-warning-soft-foreground focus-visible:border-warning-focus",
        "ghost-info":
          "surface-ghost-info-soft text-info-soft-foreground focus-visible:border-info-focus",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        xs: "h-6 gap-1 rounded-button-xs px-2 text-control-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-button-sm px-2.5 text-control-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-button-xs in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-button-sm in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
