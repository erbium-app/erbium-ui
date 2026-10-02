import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import { Separator } from "./separator";

type ToolbarActionProps = VariantProps<typeof buttonVariants>;

function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex w-fit items-center gap-1 rounded-lg border surface-panel p-1 text-foreground data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cn(
        "flex items-center gap-0.5 data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarButton({
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ToolbarPrimitive.Button.Props & ToolbarActionProps) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function ToolbarLink({
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ToolbarPrimitive.Link.Props & ToolbarActionProps) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      className={cn(
        "h-7 min-w-0 rounded-lg border surface-field px-2.5 text-sm outline-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarSeparator({
  className,
  variant = "full",
  ...props
}: Omit<ToolbarPrimitive.Separator.Props, "render"> & {
  variant?: React.ComponentProps<typeof Separator>["variant"];
}) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("self-stretch data-horizontal:my-1 data-vertical:mx-1", className)}
      render={<Separator variant={variant} />}
      {...props}
    />
  );
}

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator };
