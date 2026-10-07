import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import XIcon from "@hugeicons/core-free-icons/XIcon";

const SheetPanelContext = React.createContext(false);

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay-backdrop transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function SheetPanel({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPanelContext.Provider value={true}>
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Popup
          data-slot="sheet-panel"
          data-side={side}
          className={cn(
            "group/sheet-panel fixed z-50 flex max-h-dvh min-h-0 flex-col overflow-hidden border surface-modal text-sm text-popover-foreground transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10 data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:data-ending-style:-translate-x-10 rtl:data-[side=left]:data-ending-style:translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 rtl:data-[side=left]:data-starting-style:translate-x-10 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:data-ending-style:translate-x-10 rtl:data-[side=right]:data-ending-style:-translate-x-10 data-[side=right]:data-starting-style:translate-x-10 rtl:data-[side=right]:data-starting-style:-translate-x-10 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot="sheet-close"
              render={
                <Button variant="ghost" className="absolute top-3 inset-e-3" size="icon-sm" />
              }
            >
              <HugeiconsIcon icon={XIcon} />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPortal>
    </SheetPanelContext.Provider>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  if (!React.useContext(SheetPanelContext)) {
    throw new Error("SheetHeader must be used inside SheetPanel.");
  }
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-2 p-6 pb-3", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  if (!React.useContext(SheetPanelContext)) {
    throw new Error("SheetFooter must be used inside SheetPanel.");
  }
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col-reverse gap-2 border-t bg-footer px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({ className, children, ...props }: React.ComponentProps<"div">) {
  if (!React.useContext(SheetPanelContext)) {
    throw new Error("SheetContent must be used inside SheetPanel.");
  }

  return (
    <ScrollArea
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      fade="vertical"
      scrollbar="thin"
      viewportClassName="min-h-0 flex-1 overscroll-contain"
      viewportRender={<div data-slot="sheet-content" {...props} />}
      contentClassName={cn(
        "separator-inset p-6 group-has-[[data-slot=sheet-header]]/sheet-panel:pt-1",
        className,
      )}
    >
      {children}
    </ScrollArea>
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-heading text-base font-medium text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPanel,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
