import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none hover:tint-hover hover:text-foreground active:tint-press focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 aria-invalid:[--surface-edge:var(--destructive)] aria-invalid:focus-visible:border-destructive aria-invalid:aria-pressed:border-destructive aria-invalid:data-[state=on]:border-destructive engaged:bg-surface-control engaged:text-foreground engaged:tint-press engaged:hover:tint-press engaged:shadow-engaged engaged:active:shadow-pressed dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:border-destructive/50 dark:aria-invalid:aria-pressed:border-destructive/50 dark:aria-invalid:data-[state=on]:border-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Flat at rest; selection introduces a recessed surface. */
        default: "bg-transparent",
        /* Raised at rest; selection presses the same surface into its surrounding plane. */
        outline:
          "border border-surface-border bg-surface-control shadow-control active:shadow-pressed disabled:shadow-edge data-disabled:shadow-edge engaged:disabled:shadow-edge engaged:data-disabled:shadow-edge",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
