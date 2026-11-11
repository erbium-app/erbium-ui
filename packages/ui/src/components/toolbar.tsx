import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import { Separator } from "./separator";

type ToolbarActionProps = VariantProps<typeof buttonVariants>;

const Toolbar = ({ className, ...props }: ToolbarPrimitive.Root.Props) => (
  <ToolbarPrimitive.Root
    data-slot="toolbar"
    className={cn(
      "flex w-fit items-center gap-1 rounded-lg surface-panel p-1 text-foreground data-vertical:flex-col data-vertical:items-stretch",
      className,
    )}
    {...props}
  />
);

const ToolbarGroup = ({ className, ...props }: ToolbarPrimitive.Group.Props) => (
  <ToolbarPrimitive.Group
    data-slot="toolbar-group"
    className={cn(
      "flex items-center gap-0.5 data-vertical:flex-col data-vertical:items-stretch",
      className,
    )}
    {...props}
  />
);

const ToolbarButton = ({
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ToolbarPrimitive.Button.Props & ToolbarActionProps) => (
  <ToolbarPrimitive.Button
    data-slot="toolbar-button"
    data-variant={variant}
    data-size={size}
    className={cn(buttonVariants({ size, variant }), className)}
    {...props}
  />
);

const ToolbarLink = ({
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ToolbarPrimitive.Link.Props & ToolbarActionProps) => (
  <ToolbarPrimitive.Link
    data-slot="toolbar-link"
    data-variant={variant}
    data-size={size}
    className={cn(buttonVariants({ size, variant }), className)}
    {...props}
  />
);

const ToolbarInput = ({ className, ...props }: ToolbarPrimitive.Input.Props) => (
  <ToolbarPrimitive.Input
    data-slot="toolbar-input"
    className={cn(
      "control-size min-w-0 rounded-lg border surface-field text-field outline-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

const ToolbarSeparator = ({
  className,
  variant = "full",
  ...props
}: Omit<ToolbarPrimitive.Separator.Props, "render"> & {
  variant?: React.ComponentProps<typeof Separator>["variant"];
}) => (
  <ToolbarPrimitive.Separator
    data-slot="toolbar-separator"
    className={cn("self-stretch data-horizontal:my-1 data-vertical:mx-1", className)}
    render={<Separator variant={variant} />}
    {...props}
  />
);

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator };
