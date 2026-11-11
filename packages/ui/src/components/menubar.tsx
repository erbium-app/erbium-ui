import * as React from "react";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const Menubar = ({ className, ...props }: MenubarPrimitive.Props) => (
  <MenubarPrimitive
    data-slot="menubar"
    className={cn("flex min-h-control items-center gap-0.5 rounded-lg border p-0.75", className)}
    {...props}
  />
);

const MenubarMenu = ({ ...props }: React.ComponentProps<typeof DropdownMenu>) => (
  <DropdownMenu data-slot="menubar-menu" {...props} />
);

const MenubarGroup = ({ ...props }: React.ComponentProps<typeof DropdownMenuGroup>) => (
  <DropdownMenuGroup data-slot="menubar-group" data-filter-section {...props} />
);

const MenubarPortal = ({ ...props }: React.ComponentProps<typeof DropdownMenuPortal>) => (
  <DropdownMenuPortal data-slot="menubar-portal" {...props} />
);

const MenubarTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) => (
  <DropdownMenuTrigger
    data-slot="menubar-trigger"
    className={cn(
      "flex items-center rounded-sm segmented-size px-control-inset py-0 text-control-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
      className,
    )}
    {...props}
  />
);

const MenubarContent = ({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) => (
  <DropdownMenuContent
    data-slot="menubar-content"
    align={align}
    alignOffset={alignOffset}
    sideOffset={sideOffset}
    className={cn(
      "min-w-40 rounded-lg surface-overlay text-popover-foreground duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
      className,
    )}
    {...props}
  />
);

const MenubarItem = ({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) => (
  <DropdownMenuItem
    data-slot="menubar-item"
    data-inset={inset}
    data-variant={variant}
    className={cn("group/menubar-item", className)}
    {...props}
  />
);

const MenubarCheckboxItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) => (
  <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
);

const MenubarRadioGroup = ({ ...props }: React.ComponentProps<typeof DropdownMenuRadioGroup>) => (
  <DropdownMenuRadioGroup data-slot="menubar-radio-group" data-filter-section {...props} />
);

const MenubarRadioItem = ({ ...props }: React.ComponentProps<typeof DropdownMenuRadioItem>) => (
  <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />
);

const MenubarLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel> & {
  inset?: boolean;
}) => (
  <DropdownMenuLabel
    data-slot="menubar-label"
    data-inset={inset}
    className={className}
    {...props}
  />
);

const MenubarSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) => (
  <DropdownMenuSeparator
    data-slot="menubar-separator"
    className={cn("-mx-1 my-1", className)}
    {...props}
  />
);

const MenubarShortcut = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) => (
  <DropdownMenuShortcut
    data-slot="menubar-shortcut"
    className={cn(
      "group-hover/menubar-item:text-accent-foreground group-focus/menubar-item:text-accent-foreground",
      className,
    )}
    {...props}
  />
);

const MenubarSub = ({ ...props }: React.ComponentProps<typeof DropdownMenuSub>) => (
  <DropdownMenuSub data-slot="menubar-sub" {...props} />
);

const MenubarSubTrigger = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger> & {
  inset?: boolean;
}) => (
  <DropdownMenuSubTrigger
    data-slot="menubar-sub-trigger"
    data-inset={inset}
    className={cn("group/menubar-sub-trigger", className)}
    {...props}
  />
);

const MenubarSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) => (
  <DropdownMenuSubContent
    data-slot="menubar-sub-content"
    className={cn(
      "min-w-40 rounded-lg surface-overlay text-popover-foreground duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
      className,
    )}
    {...props}
  />
);

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};

export {
  DropdownMenuSearch as MenubarSearch,
  DropdownMenuList as MenubarList,
  DropdownMenuEmpty as MenubarEmpty,
} from "./dropdown-menu";
