import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { Icon } from "./icon";

const DialogPanelContext = React.createContext(false);

const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = ({ ...props }: DialogPrimitive.Trigger.Props) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = ({ ...props }: DialogPrimitive.Close.Props) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

const DialogOverlay = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => (
  <DialogPrimitive.Backdrop
    data-slot="dialog-overlay"
    className={cn(
      "fixed inset-0 isolate z-50 bg-overlay-backdrop duration-100 supports-backdrop-filter:backdrop-blur-(--overlay-backdrop-blur,2px) data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
      className,
    )}
    {...props}
  />
);

const DialogViewport = ({ className, ...props }: DialogPrimitive.Viewport.Props) => (
  <DialogPrimitive.Viewport
    data-slot="dialog-viewport"
    className={cn(
      "fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4",
      className,
    )}
    {...props}
  />
);

const DialogPanel = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) => (
  <DialogPanelContext.Provider value={true}>
    <DialogPortal>
      <DialogOverlay />
      <DialogViewport>
        <DialogPrimitive.Popup
          data-slot="dialog-panel"
          className={cn(
            "group/dialog-panel relative row-start-2 flex max-h-[calc(100dvh-2rem)] min-h-0 w-full max-w-full flex-col overflow-hidden rounded-xl surface-modal text-caption text-popover-foreground duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
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
        </DialogPrimitive.Popup>
      </DialogViewport>
    </DialogPortal>
  </DialogPanelContext.Provider>
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(DialogPanelContext)) {
    throw new Error("DialogHeader must be used inside DialogPanel.");
  }

  return (
    <>
      <div
        data-slot="dialog-header"
        className={cn("flex shrink-0 flex-col gap-1 px-panel pt-4 pb-2", className)}
        {...props}
      />
      <Separator variant="full" />
    </>
  );
};

const DialogContent = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(DialogPanelContext)) {
    throw new Error("DialogContent must be used inside DialogPanel.");
  }

  return (
    <ScrollArea
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      fade="vertical"
      scrollbar="thin"
      viewportClassName="min-h-0 flex-1 overscroll-contain"
      viewportRender={<div data-slot="dialog-content" {...props} />}
      contentClassName={cn(
        "separator-inset p-panel group-has-[[data-slot=dialog-header]]/dialog-panel:pt-2",
        className,
      )}
    >
      {children}
    </ScrollArea>
  );
};

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) => {
  if (!React.useContext(DialogPanelContext)) {
    throw new Error("DialogFooter must be used inside DialogPanel.");
  }

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-related surface-footer px-panel py-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>Close</DialogPrimitive.Close>
      )}
    </div>
  );
};

const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    className={cn("text-subtitle", className)}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }: DialogPrimitive.Description.Props) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    className={cn(
      "text-caption text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
      className,
    )}
    {...props}
  />
);

export {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
