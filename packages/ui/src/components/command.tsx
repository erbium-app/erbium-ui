import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";
import { Dialog, DialogPanel, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl border surface-overlay text-popover-foreground in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:border-0 in-data-[slot=dialog-content]:bg-transparent in-data-[slot=dialog-content]:shadow-none in-data-[slot=popover-content]:rounded-none in-data-[slot=popover-content]:border-0 in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:shadow-none",
        className,
      )}
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
        className={cn("top-1/3 translate-y-0 overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <DialogContent className="overflow-hidden p-0">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
          {children}
        </DialogContent>
      </DialogPanel>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper">
      <div className="flex h-10 items-center gap-2 px-3">
        <HugeiconsIcon
          icon={Search01Icon}
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
      <Separator variant="full" />
    </div>
  );
}

function CommandList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <ScrollArea
      className="min-h-0 max-h-72 overscroll-contain"
      fade="vertical"
      scrollbar="thin"
      viewportClassName="max-h-72 overflow-x-hidden! scroll-py-1"
      viewportRender={
        <CommandPrimitive.List
          data-slot="command-list"
          className={cn("outline-none", className)}
          {...props}
        />
      }
      contentClassName="p-1"
    >
      {children}
    </ScrollArea>
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  // cmdk keeps its own asChild API; a spread also preserves it through
  // shadcn's Base UI registry conversion of literal asChild attributes.
  const separatorProps = { asChild: true, ...props };
  return (
    <CommandPrimitive.Separator {...separatorProps}>
      <Separator data-slot="command-separator" className={cn("-mx-1 my-1", className)} />
    </CommandPrimitive.Separator>
  );
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:*:[svg]:text-accent-foreground data-selected:*:[svg]:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={CheckIcon}
        className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<typeof Kbd>) {
  return (
    <Kbd
      data-slot="command-shortcut"
      className={cn(
        "ms-auto group-hover/command-item:text-accent-foreground group-data-selected/command-item:text-accent-foreground",
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
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
