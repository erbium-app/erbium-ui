import * as React from "react";
import { Autocomplete as CommandPrimitive } from "@base-ui/react/autocomplete";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { focusSearchInput } from "../lib/focus-search-input";
import { ModalHotkeysScope } from "../lib/modal-hotkeys-scope";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Kbd } from "./kbd";
import { Dialog, DialogOverlay, DialogPortal, DialogDescription, DialogTitle } from "./dialog";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Icon } from "./icon";

type CommandProps<ItemValue> = Omit<CommandPrimitive.Root.Props<ItemValue>, "items"> & {
  items?: readonly ItemValue[];
  className?: string;
};

interface CommandComponent {
  <Items extends readonly { items: readonly unknown[] }[]>(
    props: Omit<CommandPrimitive.Root.Props<Items[number]["items"][number]>, "items"> & {
      items: Items;
      className?: string;
    },
  ): React.JSX.Element;
  <ItemValue>(props: CommandProps<ItemValue>): React.JSX.Element;
}

const Command: CommandComponent = <ItemValue,>({
  className,
  children,
  autoHighlight = "always",
  keepHighlight = true,
  ...props
}: CommandProps<ItemValue>): React.JSX.Element => (
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

const CommandCollection = CommandPrimitive.Collection;

const CommandGroupLabel = ({ className, ...props }: CommandPrimitive.GroupLabel.Props) => (
  <CommandPrimitive.GroupLabel
    data-slot="command-group-label"
    className={cn("px-2 py-1.5 text-control-sm text-muted-foreground", className)}
    {...props}
  />
);

const CommandDialogViewport = ({ className, ...props }: DialogPrimitive.Viewport.Props) => (
  <DialogPrimitive.Viewport
    data-slot="command-dialog-viewport"
    className={cn(
      "fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]",
      className,
    )}
    {...props}
  />
);

const CommandDialog = ({
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
}) => (
  <Dialog {...props}>
    <DialogPortal>
      <DialogOverlay />
      <CommandDialogViewport>
        <DialogPrimitive.Popup
          data-slot="dialog-panel"
          className={cn(
            "relative flex max-h-105 min-h-0 w-full max-w-xl flex-col overflow-hidden rounded-xl surface-modal text-caption text-popover-foreground duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
        >
          <ModalHotkeysScope modal={props.modal}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                render={
                  <Button variant="ghost" className="absolute top-2 inset-e-2" size="icon-sm" />
                }
              >
                <Icon name="x" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </ModalHotkeysScope>
        </DialogPrimitive.Popup>
      </CommandDialogViewport>
    </DialogPortal>
  </Dialog>
);

const CommandInput = ({ className, ...props }: CommandPrimitive.Input.Props) => (
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

const CommandList = ({ className, children, ...props }: CommandPrimitive.List.Props) => (
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

const CommandEmpty = ({ className, ...props }: CommandPrimitive.Empty.Props) => (
  <CommandPrimitive.Empty
    data-slot="command-empty"
    className={cn("not-empty:py-6 text-center text-control", className)}
    {...props}
  />
);

const CommandGroup = ({ className, ...props }: CommandPrimitive.Group.Props) => (
  <CommandPrimitive.Group
    data-slot="command-group"
    className={cn("overflow-hidden text-foreground", className)}
    {...props}
  />
);

const CommandSeparator = ({ className, ...props }: CommandPrimitive.Separator.Props) => (
  <CommandPrimitive.Separator
    data-slot="command-separator"
    render={<Separator />}
    className={cn("-mx-1 my-1", className)}
    {...props}
  />
);

const CommandItem = ({ className, children, ...props }: CommandPrimitive.Item.Props) => (
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

const CommandShortcut = ({ className, ...props }: React.ComponentProps<typeof Kbd>) => (
  <Kbd
    data-slot="command-shortcut"
    className={cn(
      "ms-auto group-hover/command-item:text-accent-foreground group-data-highlighted/command-item:text-accent-foreground",
      className,
    )}
    {...props}
  />
);

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
