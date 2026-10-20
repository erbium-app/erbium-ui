import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { Separator } from "./separator";

import { Icon } from "./icon";
import { CheckboxStateIcon, RotatingChevron } from "./stateful-icon";

function ContextMenu({
  searchable = false,
  ...props
}: ContextMenuPrimitive.Root.Props & {
  /** Filter actions using the shared flush search header. */
  searchable?: boolean;
}) {
  const menu = <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;

  return searchable ? (
    <MenuPrimitive.FilterProvider autoHighlight>{menu}</MenuPrimitive.FilterProvider>
  ) : (
    menu
  );
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("group select-none", className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  children,
  align = "center",
  alignOffset,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 max-w-(--available-width) outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "z-50 flex max-h-(--available-height) min-w-40 flex-col origin-(--transform-origin) overflow-hidden rounded-lg surface-overlay text-popover-foreground duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" data-filter-section {...props} />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-control-sm font-medium text-muted-foreground data-inset:ps-7",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "error";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/context-menu-item relative flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=error]:hover:**:text-accent-foreground not-data-[variant=error]:focus:**:text-accent-foreground data-inset:ps-7 data-[variant=error]:text-error data-[variant=error]:hover:bg-error-interactive data-[variant=error]:hover:text-error data-[variant=error]:focus:bg-error-interactive data-[variant=error]:focus:text-error data-[variant=error]:data-highlighted:bg-error-interactive data-[variant=error]:data-highlighted:text-error data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon data-[variant=error]:*:[svg]:text-error",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSub({
  searchable = false,
  ...props
}: ContextMenuPrimitive.SubmenuRoot.Props & {
  /** Filter actions using the shared flush search header. */
  searchable?: boolean;
}) {
  const menu = <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;

  return searchable ? (
    <MenuPrimitive.FilterProvider autoHighlight>{menu}</MenuPrimitive.FilterProvider>
  ) : (
    menu
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "group group/context-menu-sub-trigger flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      {children}
      <RotatingChevron direction="inline-end" className="ms-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({
  className,
  sideOffset = 0,
  alignOffset,
  align = "start",
  ...props
}: ContextMenuPrimitive.Popup.Props & {
  align?: ContextMenuPrimitive.Positioner.Props["align"];
  sideOffset?: ContextMenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: ContextMenuPrimitive.Positioner.Props["alignOffset"];
}) {
  const defaultAlignOffset = align === "center" ? undefined : -5;

  return (
    <ContextMenuContent
      align={align}
      alignOffset={alignOffset ?? defaultAlignOffset}
      className={className}
      data-slot="context-menu-sub-content"
      side="inline-end"
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center rounded-md row-size pe-8 text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute inset-e-2">
        <ContextMenuPrimitive.CheckboxItemIndicator
          keepMounted
          className="group/check-indicator inline-grid"
        >
          <CheckboxStateIcon className="size-control-icon" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({ ...props }: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      data-filter-section
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center rounded-md row-size pe-8 text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-e-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <Icon name="check" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuSeparator({ className, ...props }: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1", className)}
      render={<Separator />}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<typeof Kbd>) {
  return (
    <Kbd
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto group-hover/context-menu-item:text-accent-foreground group-focus/context-menu-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

export {
  MenuSearch as ContextMenuSearch,
  MenuList as ContextMenuList,
  MenuEmpty as ContextMenuEmpty,
} from "./menu-search";
