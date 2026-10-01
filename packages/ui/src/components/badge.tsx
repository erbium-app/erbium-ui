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
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,box-shadow] focus-visible:border-ring has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 aria-invalid:focus-visible:border-destructive dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:border-destructive/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "surface-fill-primary text-primary-foreground",
        secondary: "surface-flat bg-secondary text-secondary-foreground",
        destructive: "surface-tint-destructive-soft text-destructive-soft-foreground",
        info: "surface-tint-info-soft text-info-soft-foreground",
        success: "surface-tint-success-soft text-success-soft-foreground",
        warning: "surface-tint-warning-soft text-warning-soft-foreground",
        "ghost-destructive": "surface-ghost-destructive-soft text-destructive-soft-foreground",
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
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeStatusIcons = {
  destructive: OctagonXIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  "ghost-destructive": OctagonXIcon,
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
