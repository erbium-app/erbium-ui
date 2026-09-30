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
        default: "surface-fill-primary text-primary-foreground [a]:hover:tint-hover",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:tint-hover",
        destructive:
          "surface-tint-destructive-soft text-destructive-soft-foreground [a]:hover:surface-tint-destructive-soft-hover",
        info: "surface-tint-info-soft text-info-soft-foreground [a]:hover:surface-tint-info-soft-hover",
        success:
          "surface-tint-success-soft text-success-soft-foreground [a]:hover:surface-tint-success-soft-hover",
        warning:
          "surface-tint-warning-soft text-warning-soft-foreground [a]:hover:surface-tint-warning-soft-hover",
        "ghost-destructive":
          "bg-transparent text-destructive-soft-foreground hover:bg-destructive-soft [a]:hover:bg-destructive-soft",
        "ghost-info":
          "bg-transparent text-info-soft-foreground hover:bg-info-soft [a]:hover:bg-info-soft",
        "ghost-success":
          "bg-transparent text-success-soft-foreground hover:bg-success-soft [a]:hover:bg-success-soft",
        "ghost-warning":
          "bg-transparent text-warning-soft-foreground hover:bg-warning-soft [a]:hover:bg-warning-soft",
        "tag-gray": "surface-tag bg-tag-gray/10 text-tag-gray dark:bg-tag-gray/15",
        "tag-red": "surface-tag bg-tag-red/10 text-tag-red dark:bg-tag-red/15",
        "tag-orange": "surface-tag bg-tag-orange/10 text-tag-orange dark:bg-tag-orange/15",
        "tag-yellow":
          "surface-tag bg-tag-yellow/15 text-tag-yellow-foreground dark:bg-tag-yellow/15",
        "tag-green": "surface-tag bg-tag-green/10 text-tag-green dark:bg-tag-green/15",
        "tag-cyan": "surface-tag bg-tag-cyan/10 text-tag-cyan dark:bg-tag-cyan/15",
        "tag-blue": "surface-tag bg-tag-blue/10 text-tag-blue dark:bg-tag-blue/15",
        "tag-purple": "surface-tag bg-tag-purple/10 text-tag-purple dark:bg-tag-purple/15",
        "tag-magenta": "surface-tag bg-tag-magenta/10 text-tag-magenta dark:bg-tag-magenta/15",
        outline:
          "border-surface-border bg-surface-control text-foreground shadow-control [a]:hover:tint-hover",
        ghost: "hover:tint-hover hover:text-foreground",
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
