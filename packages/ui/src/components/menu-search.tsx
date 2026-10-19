import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Icon } from "./icon";
import { cn } from "../lib/utils";
import { focusSearchInput } from "../lib/focus-search-input";
import { Button } from "./button";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";

/** Fixed flush header. Menu owns filtering, focus, and keyboard navigation. */
function MenuSearch({
  className,
  placeholder = "Search actions…",
  ...props
}: MenuPrimitive.Input.Props) {
  return (
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
}

/** Only the list scrolls; search and other popup siblings stay fixed. */
function MenuList({ className, children, ...props }: MenuPrimitive.List.Props) {
  return (
    <ScrollArea
      className="flex min-h-0 max-h-72 flex-col overflow-hidden overscroll-contain"
      fade="vertical"
      scrollbar="thin"
      viewportClassName="min-h-0 max-h-72 flex-1 overflow-x-hidden! scroll-py-1"
    >
      <MenuPrimitive.List
        data-slot="menu-list"
        className={cn("p-1 outline-none in-data-has-overflow-y:pe-3", className)}
        {...props}
      >
        {children}
      </MenuPrimitive.List>
    </ScrollArea>
  );
}

function MenuEmpty({
  className,
  children = "No actions found.",
  ...props
}: MenuPrimitive.Empty.Props) {
  return (
    <MenuPrimitive.Empty
      data-slot="menu-empty"
      className={cn(
        "px-control-inset py-panel text-center text-control text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Empty>
  );
}

export { MenuSearch, MenuList, MenuEmpty };
