import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea } from "./scroll-area";

/* A raised panel. The trigger is a sibling overlay, so the root paints its hover, press, and
   focus through the surface tokens. Idle files are not attached yet: they drop the elevation
   and trace a dashed outline, which sits where the rim does, so the box does not move. Focus
   uses an arbitrary variant because those sort last, so the ring beats the error rim and the
   idle outline. The size sets the padding as variables, so flush image media can bleed by it.
   The corner remove badge and its notch live in styles/attachment.css. */
const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl surface-panel px-(--attachment-px) py-(--attachment-py) text-card-foreground transition-[color,background-color,box-shadow,outline-color,--attachment-notch] duration-150 has-[>[data-slot=attachment-trigger]]:hover:[--surface-tint:var(--surface-tint-hover)] has-[>[data-slot=attachment-trigger]:active]:[--surface-tint:var(--surface-tint-pressed)] data-[state=error]:[--surface-rim:color-mix(in_oklab,var(--error)_30%,transparent)] data-[state=idle]:shadow-none data-[state=idle]:outline-1 data-[state=idle]:outline-border data-[state=idle]:outline-dashed motion-reduce:transition-none [&:has(>[data-slot=attachment-trigger]:focus-visible)]:outline-ring [&:has(>[data-slot=attachment-trigger]:focus-visible)]:[--surface-rim:var(--ring)]",
  {
    variants: {
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-40",
      },
      size: {
        default:
          "gap-related text-caption [--attachment-px:--spacing(2)] [--attachment-py:--spacing(2)] has-data-[slot=attachment-content]:[--attachment-px:--spacing(2.5)]",
        sm: "gap-2.5 text-metadata [--attachment-px:--spacing(1.5)] [--attachment-py:--spacing(1.5)] has-data-[slot=attachment-content]:[--attachment-px:--spacing(2)]",
        xs: "gap-1.5 rounded-lg text-metadata [--attachment-px:--spacing(1)] [--attachment-py:--spacing(1)] has-data-[slot=attachment-content]:[--attachment-px:--spacing(1.5)]",
      },
    },
  },
);

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";

const Attachment = ({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState;
  }) => (
  <div
    data-slot="attachment"
    data-state={state}
    data-size={size}
    data-orientation={orientation}
    className={cn(attachmentVariants({ orientation, size }), className)}
    {...props}
  />
);

/* Vertical image media sits flush like CardMedia; the rules live in styles/attachment.css so
   they also cover media wrapped in a trigger. */
const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-error/10 group-data-[state=error]/attachment:text-error group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    defaultVariants: {
      variant: "icon",
    },
    variants: {
      variant: {
        icon: "",
        image:
          "image-hairline opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:size-full *:[img]:object-cover",
      },
    },
  },
);

const AttachmentMedia = ({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) => (
  <div
    data-slot="attachment-media"
    data-variant={variant}
    className={cn(attachmentMediaVariants({ variant }), className)}
    {...props}
  />
);

const AttachmentContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="attachment-content"
    className={cn(
      "max-w-full min-w-0 flex-1 group-data-[orientation=vertical]/attachment:px-1",
      className,
    )}
    {...props}
  />
);

const AttachmentTitle = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="attachment-title"
    className={cn(
      "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
      className,
    )}
    {...props}
  />
);

const AttachmentDescription = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="attachment-description"
    className={cn(
      "mt-0.5 block min-w-0 truncate text-metadata text-muted-foreground group-data-[state=error]/attachment:text-error",
      "max-w-full",
      className,
    )}
    {...props}
  />
);

const AttachmentActions = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="attachment-actions"
    className={cn(
      "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:inset-e-3 group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:gap-1",
      className,
    )}
    {...props}
  />
);

const AttachmentAction = ({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    data-slot="attachment-action"
    variant={variant ?? "ghost"}
    size={size}
    className={cn(className)}
    {...props}
  />
);

/* Empty, the trigger is an overlay over the whole card. Wrapping AttachmentMedia, it takes the
   media's place, so a trigger that morphs from its own box (LightboxTrigger) morphs from the
   media, and a stretched ::before still makes the whole card its hit area. Actions and the
   remove badge stack above either way. Wrapping, it matches the media's radius, which the
   morph reads. */
const AttachmentTrigger = ({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) =>
  useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "shrink-0 outline-none not-empty:rounded-lg group-data-[size=xs]/attachment:not-empty:rounded-md not-empty:before:absolute not-empty:before:inset-0 not-empty:before:z-10 empty:absolute empty:inset-0 empty:z-10",
          className,
        ),
        type: render ? type : (type ?? "button"),
      },
      props,
    ),
    state: {
      slot: "attachment-trigger",
    },
  });

/* A round control that straddles the top-end corner. The card is notched around it, like an
   avatar badge, and it shows on hover or focus, or always where there is no hover. */
const AttachmentRemove = ({
  className,
  render,
  type,
  children,
  ...props
}: useRender.ComponentProps<"button">) =>
  useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        children: children ?? <Icon name="x" />,
        className: cn(
          "touch-target absolute -inset-e-(--attachment-remove-offset) -top-(--attachment-remove-offset) z-30 inline-flex size-(--attachment-remove-size) items-center justify-center rounded-full surface-control text-muted-foreground transition-[opacity,scale,color,box-shadow] duration-150 outline-none hover:text-foreground focus-visible:[--surface-rim:var(--ring)] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
          className,
        ),
        type: render ? type : (type ?? "button"),
      },
      props,
    ),
    state: {
      slot: "attachment-remove",
    },
  });

const AttachmentGroup = ({ className, children, ...props }: React.ComponentProps<"div">) => (
  <ScrollArea
    className="min-w-0"
    fade="horizontal"
    scrollbar="none"
    viewportClassName="overflow-y-hidden!"
    viewportRender={
      <div
        data-slot="attachment-group"
        className={cn("snap-x snap-mandatory scroll-px-1 overscroll-x-contain", className)}
        {...props}
      />
    }
    contentClassName="flex min-w-full gap-3 py-1 has-data-[slot=attachment-remove]:pt-2 has-data-[slot=attachment-remove]:pe-2 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start"
  >
    {children}
  </ScrollArea>
);

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentRemove,
};
