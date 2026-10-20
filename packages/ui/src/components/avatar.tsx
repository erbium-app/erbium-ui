import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "../lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative isolate inline-flex size-(--avatar-size,2rem) shrink-0 items-center justify-center rounded-[35%] align-middle select-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:border after:border-border after:mix-blend-darken data-[size=lg]:[--avatar-size:2.5rem] data-[size=sm]:[--avatar-size:1.5rem] dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "absolute inset-0 z-10 size-full rounded-[inherit] object-cover data-error:invisible data-loading:invisible",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "absolute inset-0 flex size-full items-center justify-center rounded-[inherit] bg-muted font-medium text-muted-foreground select-none [&>svg]:size-[calc(var(--avatar-size,2rem)*0.5)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute inset-e-0 bottom-0 z-30 inline-flex size-[max(0.5rem,calc(var(--avatar-size,2rem)*0.3125))] items-center justify-center rounded-full bg-primary bg-blend-color text-primary-foreground select-none [&>svg]:size-[calc(var(--avatar-size,2rem)*0.25)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  topmost = "last",
  ...props
}: React.ComponentProps<"div"> & { topmost?: "first" | "last" }) {
  return (
    <div
      data-slot="avatar-group"
      data-topmost={topmost}
      className={cn("group/avatar-group flex w-fit items-center", className)}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, children, ...props }: React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar
      data-slot="avatar-group-count"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      <AvatarFallback>{children}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge };
