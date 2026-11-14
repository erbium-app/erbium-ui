import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { Separator } from "./separator";

import { Icon } from "./icon";
import { CheckboxStateIcon, RotatingChevron } from "./stateful-icon";

const DropdownMenu = ({
  searchable = false,
  ...props
}: MenuPrimitive.Root.Props & {
  /** Filter actions using the shared flush search header. */
  searchable?: boolean;
}) => {
  const menu = <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;

  return searchable ? (
    <MenuPrimitive.FilterProvider autoHighlight>{menu}</MenuPrimitive.FilterProvider>
  ) : (
    menu
  );
};

const DropdownMenuPortal = ({ ...props }: MenuPrimitive.Portal.Props) => (
  <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
);

const DropdownMenuTrigger = ({ className, ...props }: MenuPrimitive.Trigger.Props) => (
  <MenuPrimitive.Trigger
    data-slot="dropdown-menu-trigger"
    className={cn("group", className)}
    {...props}
  />
);

const DropdownMenuContent = ({
  align = "center",
  alignOffset,
  side = "bottom",
  sideOffset = 4,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner
      className="isolate z-50 max-w-(--available-width) outline-none"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
    >
      <MenuPrimitive.Popup
        data-slot="dropdown-menu-content"
        className={cn(
          "z-50 flex max-h-(--available-height) min-w-40 max-w-(--available-width) flex-col origin-(--transform-origin) overflow-y-auto overscroll-contain rounded-lg surface-overlay p-1 text-popover-foreground duration-100 outline-none has-[>[data-slot=scroll-area]]:overflow-hidden has-[>[data-slot=scroll-area]]:p-0 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
      </MenuPrimitive.Popup>
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
);

const DropdownMenuGroup = ({ ...props }: MenuPrimitive.Group.Props) => (
  <MenuPrimitive.Group data-slot="dropdown-menu-group" data-filter-section {...props} />
);

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => (
  <MenuPrimitive.GroupLabel
    data-slot="dropdown-menu-label"
    data-inset={inset}
    className={cn("px-2 py-1.5 text-control-sm text-muted-foreground data-inset:ps-7", className)}
    {...props}
  />
);

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "error";
}) => (
  <MenuPrimitive.Item
    data-slot="dropdown-menu-item"
    data-inset={inset}
    data-variant={variant}
    className={cn(
      "group/dropdown-menu-item relative flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=error]:hover:**:text-accent-foreground not-data-[variant=error]:focus:**:text-accent-foreground data-inset:ps-7 data-[variant=error]:text-error data-[variant=error]:hover:bg-error-interactive data-[variant=error]:hover:text-error data-[variant=error]:focus:bg-error-interactive data-[variant=error]:focus:text-error data-[variant=error]:data-highlighted:bg-error-interactive data-[variant=error]:data-highlighted:text-error data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon data-[variant=error]:*:[svg]:text-error",
      className,
    )}
    {...props}
  />
);

const DropdownMenuSub = ({
  searchable = false,
  ...props
}: MenuPrimitive.SubmenuRoot.Props & {
  /** Filter actions using the shared flush search header. */
  searchable?: boolean;
}) => {
  const menu = <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;

  return searchable ? (
    <MenuPrimitive.FilterProvider autoHighlight>{menu}</MenuPrimitive.FilterProvider>
  ) : (
    menu
  );
};

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) => (
  <MenuPrimitive.SubmenuTrigger
    data-slot="dropdown-menu-sub-trigger"
    data-inset={inset}
    className={cn(
      "group group/dropdown-menu-sub-trigger flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    {children}
    <RotatingChevron direction="inline-end" className="ms-auto" />
  </MenuPrimitive.SubmenuTrigger>
);

const DropdownMenuSubContent = ({
  align = "start",
  alignOffset = -5,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) => (
  <DropdownMenuContent
    data-slot="dropdown-menu-sub-content"
    className={cn(
      "w-auto min-w-40 rounded-lg surface-overlay text-popover-foreground duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
      className,
    )}
    align={align}
    alignOffset={alignOffset}
    side={side}
    sideOffset={sideOffset}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) => (
  <MenuPrimitive.CheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    data-inset={inset}
    className={cn(
      "relative flex cursor-default items-center rounded-md row-size pe-8 text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span
      className="pointer-events-none absolute inset-e-2 flex items-center justify-center"
      data-slot="dropdown-menu-checkbox-item-indicator"
    >
      <MenuPrimitive.CheckboxItemIndicator
        keepMounted
        className="group/check-indicator inline-grid"
      >
        <CheckboxStateIcon className="size-control-icon" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
);

const DropdownMenuRadioGroup = ({ ...props }: MenuPrimitive.RadioGroup.Props) => (
  <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" data-filter-section {...props} />
);

const DropdownMenuRadioItem = ({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) => (
  <MenuPrimitive.RadioItem
    data-slot="dropdown-menu-radio-item"
    data-inset={inset}
    className={cn(
      "relative flex cursor-default items-center rounded-md row-size pe-8 text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    <span
      className="pointer-events-none absolute inset-e-2 flex items-center justify-center"
      data-slot="dropdown-menu-radio-item-indicator"
    >
      <MenuPrimitive.RadioItemIndicator>
        <Icon name="check" />
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
);

const DropdownMenuSeparator = ({ className, ...props }: MenuPrimitive.Separator.Props) => (
  <MenuPrimitive.Separator
    data-slot="dropdown-menu-separator"
    className={cn("-mx-1 my-1", className)}
    render={<Separator />}
    {...props}
  />
);

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<typeof Kbd>) => (
  <Kbd
    data-slot="dropdown-menu-shortcut"
    className={cn(
      "ms-auto group-hover/dropdown-menu-item:text-accent-foreground group-focus/dropdown-menu-item:text-accent-foreground",
      className,
    )}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

export {
  MenuSearch as DropdownMenuSearch,
  MenuList as DropdownMenuList,
  MenuEmpty as DropdownMenuEmpty,
} from "./menu-search";
