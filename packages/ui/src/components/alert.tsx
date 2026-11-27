import * as React from "react";
import type { IconName } from "@erbium/icons";
import { Icon } from "./icon";
import { cn } from "../lib/utils";

type AlertVariant = "default" | "info" | "success" | "warning" | "error";

const alertVariants: Record<
  AlertVariant,
  { className: string; icon: IconName; iconClassName?: string }
> = {
  default: { className: "surface-panel text-card-foreground", icon: "info" },
  error: {
    className: "surface-tint-error-soft text-error-soft-foreground",
    icon: "octagon-x",
    iconClassName: "text-error",
  },
  info: {
    className: "surface-tint-info-soft text-info-soft-foreground",
    icon: "info",
    iconClassName: "text-info",
  },
  success: {
    className: "surface-tint-success-soft text-success-soft-foreground",
    icon: "circle-check",
    iconClassName: "text-success",
  },
  warning: {
    className: "surface-tint-warning-soft text-warning-soft-foreground",
    icon: "triangle-alert",
    iconClassName: "text-warning",
  },
};

const alertClassName =
  "group/alert relative grid w-full grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-lg border px-2.5 py-2 text-start text-caption has-data-[slot=alert-action]:pe-18 [&>svg]:row-span-2 [&>svg]:size-4 [&>svg]:translate-y-0.5";

const alertTitleClassName =
  "col-start-2 text-control [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground";

const alertDescriptionClassName =
  "col-start-2 text-caption text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";

const Alert = ({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) => {
  const { className: variantClassName, icon, iconClassName } = alertVariants[variant];

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertClassName, variantClassName, className)}
      {...props}
    >
      <Icon name={icon} className={iconClassName} aria-hidden="true" />
      {children}
    </div>
  );
};

const AlertTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="alert-title" className={cn(alertTitleClassName, className)} {...props} />
);

const AlertDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-description"
    className={cn(alertDescriptionClassName, className)}
    {...props}
  />
);

const AlertAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="alert-action" className={cn("absolute inset-e-2 top-2", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription, AlertAction };

export { alertClassName, alertDescriptionClassName, alertTitleClassName, alertVariants };

export type { AlertVariant };
