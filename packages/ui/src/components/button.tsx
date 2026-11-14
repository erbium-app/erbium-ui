import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { buttonVariants } from "../lib/button-variants";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/* Spinners follow the control's icon size rather than the control height. */
const spinnerSizes = {
  default: "sm",
  icon: "sm",
  "icon-lg": "default",
  "icon-sm": "xs",
  "icon-xs": "xs",
  lg: "default",
  sm: "xs",
  xs: "xs",
} as const satisfies Record<ButtonSize, NonNullable<React.ComponentProps<typeof Spinner>["size"]>>;

const Button = ({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  loading = false,
  variant = "default",
  size = "default",
  "aria-busy": ariaBusy,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean }) => {
  const iconOnly = size?.startsWith("icon") ?? false;
  const spinnerSize = size === null ? "default" : spinnerSizes[size];

  return (
    <ButtonPrimitive
      data-slot="button"
      {...skeletonBlock}
      data-size={size}
      data-variant={variant}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || ariaBusy === true}
      disabled={disabled === true || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled === true}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    >
      {loading && (
        <Spinner aria-hidden data-icon={iconOnly ? undefined : "inline-start"} size={spinnerSize} />
      )}
      {loading && iconOnly ? null : children}
    </ButtonPrimitive>
  );
};

const ButtonShortcut = ({ className, ...props }: React.ComponentProps<typeof Kbd>) => (
  <span
    data-slot="button-shortcut"
    className="ms-1.5 -me-(--button-shortcut-inset) inline-flex shrink-0"
  >
    <Kbd
      aria-hidden
      className={cn(
        "group-data-[size=xs]/button:h-4 group-data-[size=xs]/button:min-w-4 group-data-[size=xs]/button:text-control-sm",
        className,
      )}
      {...props}
    />
  </span>
);

export { Button, ButtonShortcut };

export { buttonVariants } from "../lib/button-variants";
