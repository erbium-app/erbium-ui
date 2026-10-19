import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

import { Separator } from "./separator";

const itemGroupVariants = cva(
  "group/item-group flex w-full flex-col has-[>[data-slot=item][data-selected]]:gap-0 [&>[data-slot=item][data-selected=true]]:rounded-lg [&>[data-slot=item][data-selected=true]]:[--surface-tint:var(--surface-tint-selected)] [&>[data-slot=item][data-selected=true]:has(+[data-slot=item][data-selected=true])]:rounded-b-none [&>[data-slot=item][data-selected=true]+[data-slot=item][data-selected=true]]:rounded-t-none",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "gap-group has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-related has-[>[data-slot=item-separator]]:gap-0",
        panel: "gap-0 overflow-hidden rounded-xl surface-panel text-card-foreground",
      },
    },
  },
);

function ItemGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemGroupVariants>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      data-variant={variant}
      className={cn(itemGroupVariants({ className, variant }))}
      {...props}
    />
  );
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      variant="inset"
      className={cn(
        "my-2 group-data-[variant=panel]/item-group:mx-1 group-data-[variant=panel]/item-group:my-0",
        className,
      )}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border border-transparent text-caption transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none [a]:focus-visible:border-ring [a]:focus-visible:ring-2 [a]:focus-visible:ring-focus-halo group-data-[variant=panel]/item-group:rounded-none group-data-[variant=panel]/item-group:border-0 group-data-[variant=panel]/item-group:bg-transparent group-data-[variant=panel]/item-group:px-panel group-data-[variant=panel]/item-group:py-panel group-data-[variant=panel]/item-group:shadow-none",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "gap-group p-panel",
        sm: "gap-related p-panel-sm",
        xs: "gap-related px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
      variant: {
        card: "surface-panel text-card-foreground",
        default: "surface-flat",
      },
    },
  },
);

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ className, size, variant })),
      },
      props,
    ),
    render,
    state: {
      size,
      slot: "item",
      variant,
    },
  });
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-related group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
  },
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ className, variant }))}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-related text-control underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-start text-caption font-normal text-muted-foreground group-data-[size=xs]/item:text-metadata [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-related", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-related", className)}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-related rounded-md carve-top bg-footer p-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
