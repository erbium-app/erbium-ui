import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { RotatingChevron } from "./stateful-icon";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const Select = SelectPrimitive.Root;

const SelectGroup = ({ className, ...props }: SelectPrimitive.Group.Props) => (
  <SelectPrimitive.Group
    data-slot="select-group"
    className={cn("scroll-my-1", className)}
    {...props}
  />
);

const SelectValue = ({ className, ...props }: SelectPrimitive.Value.Props) => (
  <SelectPrimitive.Value
    data-slot="select-value"
    className={cn("flex flex-1 text-start", className)}
    {...props}
  />
);

const SelectTrigger = ({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    {...skeletonBlock}
    data-size={size}
    className={cn(
      "group group/select-trigger touch-target flex control-size w-fit items-center justify-between rounded-lg border surface-control text-control-sm whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo data-placeholder:text-muted-foreground data-[size=sm]:control-size-sm data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 motion-reduce:transition-none dark:aria-invalid:border-invalid data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon
      render={
        <RotatingChevron className="pointer-events-none size-control-icon text-muted-foreground" />
      }
    />
  </SelectPrimitive.Trigger>
);

const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) => (
  <SelectPrimitive.ScrollUpArrow
    data-slot="select-scroll-up-button"
    className={cn(
      "top-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-overlay py-1 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    <Icon name="chevron-up" />
  </SelectPrimitive.ScrollUpArrow>
);

const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) => (
  <SelectPrimitive.ScrollDownArrow
    data-slot="select-scroll-down-button"
    className={cn(
      "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-overlay py-1 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    <Icon name="chevron-down" />
  </SelectPrimitive.ScrollDownArrow>
);

const SelectContent = ({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      alignItemWithTrigger={alignItemWithTrigger}
      className="z-50 select-none"
    >
      <SelectPrimitive.Popup
        data-slot="select-content"
        data-align-trigger={alignItemWithTrigger}
        className={cn(
          "relative isolate z-50 flex max-h-(--available-height) max-w-(--available-width) min-w-36 origin-(--transform-origin) flex-col overflow-hidden rounded-lg surface-overlay text-popover-foreground duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <ScrollArea
          className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain"
          fade="vertical"
          scrollbar="thin"
          viewportClassName="min-h-0 flex-1 overflow-x-hidden!"
          viewportRole="listbox"
          viewportRender={<SelectPrimitive.List />}
          contentClassName="p-1 in-data-has-overflow-y:pe-3"
        >
          {children}
        </ScrollArea>
        <SelectScrollDownButton />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ...props }: SelectPrimitive.GroupLabel.Props) => (
  <SelectPrimitive.GroupLabel
    data-slot="select-label"
    className={cn("px-2 py-1.5 text-control-sm text-muted-foreground", className)}
    {...props}
  />
);

const SelectItem = ({ className, children, ...props }: SelectPrimitive.Item.Props) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      "relative flex row-size w-full cursor-default items-center rounded-md pe-8 text-control-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=error]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-related",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-related whitespace-nowrap">
      {children}
    </SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator
      render={
        <span className="pointer-events-none absolute inset-e-2 flex size-control-icon items-center justify-center" />
      }
    >
      <Icon name="check" className="pointer-events-none" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ...props }: SelectPrimitive.Separator.Props) => (
  <SelectPrimitive.Separator
    data-slot="select-separator"
    className={cn("pointer-events-none -mx-1 my-1", className)}
    render={<Separator />}
    {...props}
  />
);

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
