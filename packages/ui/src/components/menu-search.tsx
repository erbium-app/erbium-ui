import type * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Icon } from "./icon";
import { menuEmptyClassName, menuListClassName } from "../lib/menu-styles";
import { cn } from "../lib/utils";
import { focusSearchInput } from "../lib/focus-search-input";
import { Button } from "./button";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";

/** Fixed flush header. Menu owns filtering, focus, and keyboard navigation. */
const MenuSearch = ({
  className,
  placeholder = "Search actions…",
  ...props
}: MenuPrimitive.Input.Props) => (
  <div data-slot="menu-search" className="shrink-0">
    <div
      className="flex search-input-row items-center"
      onPointerDown={(event) => {
        focusSearchInput(event.currentTarget, event);
      }}
    >
      <Icon
        name="search-01"
        aria-hidden="true"
        className="size-control-icon shrink-0 text-muted-foreground"
      />
      <MenuPrimitive.Input
        data-slot="menu-search-input"
        aria-label="Search actions"
        placeholder={placeholder}
        className={cn(
          "min-h-0 min-w-0 flex-1 bg-transparent py-0 text-field outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <MenuPrimitive.Clear
        aria-label="Clear search"
        render={<Button variant="ghost" size="icon-xs" />}
      >
        <Icon name="x" aria-hidden="true" />
      </MenuPrimitive.Clear>
    </div>
    <Separator variant="full" />
  </div>
);

/**
 * The scrolling frame of a menu list. Only the list scrolls; search and other popup siblings stay
 * fixed. Wrap a Menu-based list part in it.
 */
const MenuScroll = ({ children }: { children: React.ReactNode }) => (
  <ScrollArea
    className="flex max-h-72 min-h-0 flex-col overflow-hidden overscroll-contain"
    fade="vertical"
    scrollbar="thin"
    viewportClassName="min-h-0 max-h-72 flex-1 overflow-x-hidden! scroll-py-1"
  >
    {children}
  </ScrollArea>
);

const MenuList = ({ className, children, ...props }: MenuPrimitive.List.Props) => (
  <MenuScroll>
    <MenuPrimitive.List
      data-slot="menu-list"
      className={cn(menuListClassName, className)}
      {...props}
    >
      {children}
    </MenuPrimitive.List>
  </MenuScroll>
);

const MenuEmpty = ({
  className,
  children = "No actions found.",
  ...props
}: MenuPrimitive.Empty.Props) => (
  <MenuPrimitive.Empty
    data-slot="menu-empty"
    className={cn(menuEmptyClassName, className)}
    {...props}
  >
    {children}
  </MenuPrimitive.Empty>
);

export { MenuSearch, MenuList, MenuEmpty, MenuScroll };
