import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Icon } from "./icon";

const SheetPanelContext = React.createContext(false);

type SheetSide = "top" | "right" | "bottom" | "left";

const Sheet = ({ ...props }: SheetPrimitive.Root.Props) => (
  <SheetPrimitive.Root data-slot="sheet" {...props} />
);

const SheetTrigger = ({ ...props }: SheetPrimitive.Trigger.Props) => (
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
);

const SheetClose = ({ ...props }: SheetPrimitive.Close.Props) => (
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />
);

const SheetPortal = ({ ...props }: SheetPrimitive.Portal.Props) => (
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
);

const SheetOverlay = ({ className, ...props }: SheetPrimitive.Backdrop.Props) => (
  <SheetPrimitive.Backdrop
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-overlay-backdrop transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-(--overlay-backdrop-blur,2px)",
      className,
    )}
    {...props}
  />
);

const SheetViewport = ({
  className,
  side = "right",
  ...props
}: SheetPrimitive.Viewport.Props & {
  side?: SheetSide;
}) => (
  <SheetPrimitive.Viewport
    data-slot="sheet-viewport"
    data-side={side}
    className={cn(
      "fixed inset-0 z-50",
      side === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
      side === "top" && "grid grid-rows-[auto_1fr] pb-12",
      side === "left" && "flex justify-start",
      side === "right" && "flex justify-end",
      className,
    )}
    {...props}
  />
);

const SheetPanel = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide;
  showCloseButton?: boolean;
}) => (
  <SheetPanelContext.Provider value={true}>
    <SheetPortal>
      <SheetOverlay />
      <SheetViewport side={side}>
        <SheetPrimitive.Popup
          data-slot="sheet-panel"
          data-side={side}
          className={cn(
            "group/sheet-panel relative flex max-h-full min-h-0 flex-col overflow-hidden surface-modal text-caption text-popover-foreground transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:row-start-2 data-[side=bottom]:w-full data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:data-ending-style:-translate-x-10 rtl:data-[side=left]:data-ending-style:translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 rtl:data-[side=left]:data-starting-style:translate-x-10 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:data-ending-style:translate-x-10 rtl:data-[side=right]:data-ending-style:-translate-x-10 data-[side=right]:data-starting-style:translate-x-10 rtl:data-[side=right]:data-starting-style:-translate-x-10 data-[side=top]:w-full data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
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
              <Icon name="x" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetViewport>
    </SheetPortal>
  </SheetPanelContext.Provider>
);

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(SheetPanelContext)) {
    throw new Error("SheetHeader must be used inside SheetPanel.");
  }

  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-related p-panel pb-3", className)}
      {...props}
    />
  );
};

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(SheetPanelContext)) {
    throw new Error("SheetFooter must be used inside SheetPanel.");
  }

  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col-reverse gap-related surface-footer px-panel py-panel sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
};

const SheetContent = ({ className, children, ...props }: React.ComponentProps<"div">) => {
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
        "separator-inset p-panel group-has-[[data-slot=sheet-header]]/sheet-panel:pt-1",
        className,
      )}
    >
      {children}
    </ScrollArea>
  );
};

const SheetTitle = ({ className, ...props }: SheetPrimitive.Title.Props) => (
  <SheetPrimitive.Title
    data-slot="sheet-title"
    className={cn("text-subtitle text-foreground", className)}
    {...props}
  />
);

const SheetDescription = ({ className, ...props }: SheetPrimitive.Description.Props) => (
  <SheetPrimitive.Description
    data-slot="sheet-description"
    className={cn("text-caption text-muted-foreground", className)}
    {...props}
  />
);

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
