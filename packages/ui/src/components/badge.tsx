import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { HugeiconsIcon } from "@hugeicons/react";
import CircleCheckIcon from "@hugeicons/core-free-icons/CircleCheckIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import OctagonXIcon from "@hugeicons/core-free-icons/OctagonXIcon";
import TriangleAlertIcon from "@hugeicons/core-free-icons/TriangleAlertIcon";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { LoadingIndicator } from "./spinner";

const badgeVariants = cva(
  "group/badge inline-flex min-h-badge w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0 text-control-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] focus-visible:border-ring has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "surface-fill-primary text-primary-foreground",
        secondary: "surface-flat bg-secondary text-secondary-foreground",
        error: "surface-tint-error-soft text-error-soft-foreground",
        info: "surface-tint-info-soft text-info-soft-foreground",
        success: "surface-tint-success-soft text-success-soft-foreground",
        warning: "surface-tint-warning-soft text-warning-soft-foreground",
        "ghost-error": "surface-ghost-error-soft text-error-soft-foreground",
        "ghost-info": "surface-ghost-info-soft text-info-soft-foreground",
        "ghost-success": "surface-ghost-success-soft text-success-soft-foreground",
        "ghost-warning": "surface-ghost-warning-soft text-warning-soft-foreground",
        "tag-gray": "surface-tag-gray text-tag-gray",
        "tag-red": "surface-tag-red text-tag-red",
        "tag-orange": "surface-tag-orange text-tag-orange",
        "tag-yellow": "surface-tag-yellow text-tag-yellow-foreground",
        "tag-green": "surface-tag-green text-tag-green",
        "tag-cyan": "surface-tag-cyan text-tag-cyan",
        "tag-blue": "surface-tag-blue text-tag-blue",
        "tag-purple": "surface-tag-purple text-tag-purple",
        "tag-magenta": "surface-tag-magenta text-tag-magenta",
        outline: "surface-control text-foreground",
        ghost: "surface-flat hover:text-foreground",
        link: "text-link underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeStatusIcons = {
  error: OctagonXIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  "ghost-error": OctagonXIcon,
  "ghost-info": InfoIcon,
  "ghost-success": CircleCheckIcon,
  "ghost-warning": TriangleAlertIcon,
};

type BadgeProps = useRender.ComponentProps<"span"> & { loading?: boolean } & (
    | { variant: keyof typeof badgeStatusIcons; statusIcon: true }
    | (VariantProps<typeof badgeVariants> & { statusIcon?: false })
  );

function Badge({
  children,
  className,
  loading = false,
  variant = "default",
  statusIcon = false,
  render,
  "aria-busy": ariaBusy,
  ...props
}: BadgeProps) {
  const icon = statusIcon ? badgeStatusIcons[variant as keyof typeof badgeStatusIcons] : null;

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        "aria-busy": loading || ariaBusy,
        children: (
          <>
            {loading && <LoadingIndicator inlineStart />}
            {!loading && icon && (
              <HugeiconsIcon icon={icon} data-icon="inline-start" aria-hidden="true" />
            )}
            {children}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
