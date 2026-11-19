import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg border border-transparent text-control whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none hover:text-foreground focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error aria-invalid:aria-pressed:border-error aria-invalid:data-[state=on]:border-error motion-reduce:transition-none dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid dark:aria-invalid:aria-pressed:border-invalid dark:aria-invalid:data-[state=on]:border-invalid data-disabled:pointer-events-none data-disabled:opacity-50 engaged:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "touch-target control-size min-w-control text-control-sm [&_svg:not([class*='size-'])]:size-control-icon",
        lg: "touch-target control-size-lg min-w-control-lg text-control [&_svg:not([class*='size-'])]:size-control-icon-lg",
        sm: "touch-target control-size-sm min-w-control-sm text-control-sm [&_svg:not([class*='size-'])]:size-control-icon-sm",
      },
      variant: {
        /* Flat at rest; selection presses a control surface into its plane. */
        default: "surface-flat engaged:surface-control",
        /* Raised at rest; selection presses the same surface into its surrounding plane. */
        outline: "surface-control",
      },
    },
  },
);

const Toggle = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) => (
  <TogglePrimitive
    data-slot="toggle"
    {...skeletonBlock}
    className={cn(toggleVariants({ className, size, variant }))}
    {...props}
  />
);

export { Toggle, toggleVariants };
