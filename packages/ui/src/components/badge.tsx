import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive-soft text-destructive-soft-foreground focus-visible:ring-destructive/20 [a]:hover:bg-destructive-soft-hover",
        info: "bg-info-soft text-info-soft-foreground focus-visible:ring-info/20 [a]:hover:bg-info-soft-hover",
        success:
          "bg-success-soft text-success-soft-foreground focus-visible:ring-success/20 [a]:hover:bg-success-soft-hover",
        warning:
          "bg-warning-soft text-warning-soft-foreground focus-visible:ring-warning/20 [a]:hover:bg-warning-soft-hover",
        "ghost-destructive":
          "bg-transparent text-destructive-soft-foreground focus-visible:ring-destructive/20 hover:bg-destructive-soft [a]:hover:bg-destructive-soft",
        "ghost-info":
          "bg-transparent text-info-soft-foreground focus-visible:ring-info/20 hover:bg-info-soft [a]:hover:bg-info-soft",
        "ghost-success":
          "bg-transparent text-success-soft-foreground focus-visible:ring-success/20 hover:bg-success-soft [a]:hover:bg-success-soft",
        "ghost-warning":
          "bg-transparent text-warning-soft-foreground focus-visible:ring-warning/20 hover:bg-warning-soft [a]:hover:bg-warning-soft",
        "tag-gray": "bg-tag-gray/10 text-tag-gray dark:bg-tag-gray/15",
        "tag-red": "bg-tag-red/10 text-tag-red dark:bg-tag-red/15",
        "tag-orange": "bg-tag-orange/10 text-tag-orange dark:bg-tag-orange/15",
        "tag-yellow": "bg-tag-yellow/15 text-tag-yellow-foreground dark:bg-tag-yellow/15",
        "tag-green": "bg-tag-green/10 text-tag-green dark:bg-tag-green/15",
        "tag-cyan": "bg-tag-cyan/10 text-tag-cyan dark:bg-tag-cyan/15",
        "tag-blue": "bg-tag-blue/10 text-tag-blue dark:bg-tag-blue/15",
        "tag-purple": "bg-tag-purple/10 text-tag-purple dark:bg-tag-purple/15",
        "tag-magenta": "bg-tag-magenta/10 text-tag-magenta dark:bg-tag-magenta/15",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
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
