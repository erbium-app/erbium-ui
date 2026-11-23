import * as React from "react";
import { cn } from "../lib/utils";

const Card = ({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) => (
  <div
    data-slot="card"
    data-size={size}
    className={cn(
      "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl surface-panel py-(--card-spacing) text-caption text-card-foreground [--card-spacing:var(--panel-padding)] has-data-[slot=card-footer]:pb-0 has-[>:is(img,[data-slot=card-media]):first-child]:pt-0 has-[>:is(img,[data-slot=card-media]):last-child]:pb-0 data-[size=sm]:[--card-spacing:var(--panel-padding-compact)]",
      className,
    )}
    {...props}
  />
);

/* Media spans the card's width, so its sides sit on the card rim: inside a card the hairline
   only draws the edges that meet other sections, and none when the media fills the card. */
const CardMedia = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-media"
    className={cn(
      "image-hairline overflow-hidden",
      "[[data-slot=card]>&]:after:[box-shadow:inset_0_0.5px_var(--image-hairline),inset_0_-0.5px_var(--image-hairline)] [[data-slot=card]>&:first-child]:after:[box-shadow:inset_0_-0.5px_var(--image-hairline)] [[data-slot=card]>&:last-child]:after:[box-shadow:inset_0_0.5px_var(--image-hairline)] [[data-slot=card]>&:only-child]:after:content-none",
      className,
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-header"
    className={cn(
      "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
      className,
    )}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-title"
    className={cn(
      "text-subtitle group-data-[size=sm]/card:text-caption group-data-[size=sm]/card:font-semibold",
      className,
    )}
    {...props}
  />
);

const CardDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-description"
    className={cn("text-caption text-muted-foreground", className)}
    {...props}
  />
);

const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-action"
    className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
    {...props}
  />
);

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-content"
    className={cn("px-(--card-spacing) separator-inset", className)}
    {...props}
  />
);

const CardFooter = ({ className, children, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-footer"
    className={cn(
      "relative mt-auto flex items-center surface-footer p-(--card-spacing)",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export {
  Card,
  CardMedia,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
