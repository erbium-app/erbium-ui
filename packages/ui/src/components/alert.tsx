import * as React from "react";
import { Icon } from "./icon";
import { cn } from "../lib/utils";

type AlertVariant = "default" | "info" | "success" | "warning" | "error";

const alertVariants: Record<AlertVariant, { className: string; icon: React.ReactNode }> = {
  default: {
    className: "surface-panel text-card-foreground",
    icon: <Icon name="info" aria-hidden="true" />,
  },
  error: {
    className: "surface-tint-error-soft text-error-soft-foreground",
    icon: <Icon name="octagon-x" className="text-error" aria-hidden="true" />,
  },
  info: {
    className: "surface-tint-info-soft text-info-soft-foreground",
    icon: <Icon name="info" className="text-info" aria-hidden="true" />,
  },
  success: {
    className: "surface-tint-success-soft text-success-soft-foreground",
    icon: <Icon name="circle-check" className="text-success" aria-hidden="true" />,
  },
  warning: {
    className: "surface-tint-warning-soft text-warning-soft-foreground",
    icon: <Icon name="triangle-alert" className="text-warning" aria-hidden="true" />,
  },
};

function Alert({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "group/alert relative grid w-full grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-lg border px-2.5 py-2 text-start text-caption has-data-[slot=alert-action]:pe-18 [&>svg]:row-span-2 [&>svg]:size-4 [&>svg]:translate-y-0.5",
        alertVariants[variant].className,
        className,
      )}
      {...props}
    >
      {alertVariants[variant].icon}
      {children}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 text-control [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-caption text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 inset-e-2", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };

export type { AlertVariant };
