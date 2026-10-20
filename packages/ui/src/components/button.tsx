import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { buttonVariants } from "../lib/button-variants";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";

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
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    >
      {loading && <Spinner aria-hidden data-icon={iconOnly ? undefined : "inline-start"} />}
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

export { Button, ButtonShortcut, buttonVariants };
