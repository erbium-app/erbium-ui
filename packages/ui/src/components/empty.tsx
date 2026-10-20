import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const Empty = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty"
    className={cn(
      "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border p-8 text-center text-balance sm:p-12 dark:border-border/50",
      className,
    )}
    {...props}
  />
);

const EmptyHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty-header"
    className={cn("flex w-full max-w-sm flex-col items-center gap-1.5", className)}
    {...props}
  />
);

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg border surface-control text-foreground [&_svg:not([class*='size-'])]:size-5",
      },
    },
  },
);

const EmptyMedia = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) => (
  <div
    data-slot="empty-icon"
    data-variant={variant}
    className={cn(emptyMediaVariants({ className, variant }))}
    {...props}
  />
);

const EmptyTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="empty-title" className={cn("text-subtitle", className)} {...props} />
);

const EmptyDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty-description"
    className={cn(
      "text-caption text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link",
      className,
    )}
    {...props}
  />
);

const EmptyContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty-content"
    className={cn(
      "flex w-full max-w-sm min-w-0 flex-col items-center gap-related text-caption text-balance",
      className,
    )}
    {...props}
  />
);

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };
