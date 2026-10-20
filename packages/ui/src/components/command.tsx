import * as React from "react";
import { Autocomplete as CommandPrimitive } from "@base-ui/react/autocomplete";
import { focusSearchInput } from "../lib/focus-search-input";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { Dialog, DialogPanel, DialogDescription, DialogTitle } from "./dialog";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Icon } from "./icon";

function Command<Items extends readonly { items: readonly unknown[] }[]>(
  props: Omit<CommandPrimitive.Root.Props<Items[number]["items"][number]>, "items"> & {
    items: Items;
    className?: string;
  },
): React.JSX.Element;
function Command<ItemValue>(
  props: Omit<CommandPrimitive.Root.Props<ItemValue>, "items"> & {
    items?: readonly ItemValue[];
    className?: string;
  },
): React.JSX.Element;
function Command<ItemValue>({
  className,
  children,
  autoHighlight = "always",
  keepHighlight = true,
  ...props
}: Omit<CommandPrimitive.Root.Props<ItemValue>, "items"> & {
  items?: readonly ItemValue[];
  className?: string;
}) {
  return (
    <CommandPrimitive.Root
      autoHighlight={autoHighlight}
      keepHighlight={keepHighlight}
      {...props}
      inline
      open
    >
      <div
        data-slot="command"
        className={cn(
          "flex min-h-0 w-full flex-col overflow-hidden rounded-xl surface-overlay text-popover-foreground in-data-[slot=dialog-panel]:rounded-none in-data-[slot=dialog-panel]:border-0 in-data-[slot=dialog-panel]:bg-transparent in-data-[slot=dialog-panel]:shadow-none in-data-[slot=drawer-popup]:rounded-none in-data-[slot=drawer-popup]:border-0 in-data-[slot=drawer-popup]:bg-transparent in-data-[slot=drawer-popup]:shadow-none in-data-[slot=popover-content]:rounded-none in-data-[slot=popover-content]:border-0 in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:shadow-none",
          className,
        )}
      >
        {children}
      </div>
    </CommandPrimitive.Root>
  );
}

const CommandCollection = CommandPrimitive.Collection;

function CommandGroupLabel({ className, ...props }: CommandPrimitive.GroupLabel.Props) {
  return (
    <CommandPrimitive.GroupLabel
      data-slot="command-group-label"
      className={cn("px-2 py-1.5 text-control-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogPanel
        className={cn(
          "row-start-1 mt-[max(--spacing(4),4vh)] max-h-105 max-w-xl self-start overflow-hidden p-0 sm:mt-[10vh] sm:max-w-xl",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {children}
      </DialogPanel>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: CommandPrimitive.Input.Props) {
  return (
    <div data-slot="command-input-wrapper">
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
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "min-h-0 min-w-0 flex-1 bg-transparent py-0 text-field outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
      <Separator variant="full" />
    </div>
  );
}

function CommandList({ className, children, ...props }: CommandPrimitive.List.Props) {
  return (
    <ScrollArea
      className="flex min-h-0 max-h-72 flex-col overflow-hidden overscroll-contain"
      fade="vertical"
      scrollbar="thin"
      viewportClassName="min-h-0 max-h-72 flex-1 overflow-x-hidden! scroll-py-1"
    >
      <CommandPrimitive.List
        data-slot="command-list"
        className={cn("not-empty:p-1 outline-none", className)}
        {...props}
      >
        {children}
      </CommandPrimitive.List>
    </ScrollArea>
  );
}

function CommandEmpty({ className, ...props }: CommandPrimitive.Empty.Props) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("not-empty:py-6 text-center text-control", className)}
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: CommandPrimitive.Group.Props) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn("overflow-hidden text-foreground", className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: CommandPrimitive.Separator.Props) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      render={<Separator />}
      className={cn("-mx-1 my-1", className)}
      {...props}
    />
  );
}

function CommandItem({ className, children, ...props }: CommandPrimitive.Item.Props) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon hover:*:[svg]:text-accent-foreground data-highlighted:*:[svg]:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<typeof Kbd>) {
  return (
    <Kbd
      data-slot="command-shortcut"
      className={cn(
        "ms-auto group-hover/command-item:text-accent-foreground group-data-highlighted/command-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
