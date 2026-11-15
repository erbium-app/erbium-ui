import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { Icon } from "./icon";
import { ModalHotkeysScope } from "../lib/modal-hotkeys-scope";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { useOverlay } from "./overlay-provider";
import { ScrollArea } from "./scroll-area";

interface DrawerContextProps {
  hasSnapPoints: boolean;
  modal: DrawerPrimitive.Root.Props["modal"];
  showSwipeHandle: boolean;
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>;
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null);
const DrawerPanelContext = React.createContext(false);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.");
  }

  return context;
};

/**
 * Wraps the app's main UI. While any drawer is open it scales, rounds, and shifts away from the
 * drawer's edge over a dark layer, following the swipe. Transforms make it the containing block
 * for fixed descendants while a drawer is open, so keep fixed app chrome outside it.
 */
const DrawerIndent = ({ className, ...props }: DrawerPrimitive.Indent.Props) => {
  const { indentDirection } = useOverlay("DrawerIndent");

  return (
    <>
      <DrawerPrimitive.IndentBackground
        data-slot="drawer-indent-background"
        className="fixed inset-0 bg-overlay-base"
      />
      <DrawerPrimitive.Indent
        data-slot="drawer-indent"
        data-swipe-direction={indentDirection ?? undefined}
        className={cn(
          // Base.
          "relative min-h-dvh bg-background",
          // Motion. The transition is off while a swipe drives the progress.
          "transition-[transform,border-radius] duration-[calc(450ms*var(--indent-transition))] ease-[cubic-bezier(0.32,0.72,0,1)] [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))] motion-reduce:transition-none",
          // Inset: scale, shift, and round, easing back to rest as the drawer is swiped away.
          "[--indent-scale:calc(0.94+(0.06*var(--drawer-swipe-progress)))] [--indent-shift:calc((env(safe-area-inset-top,0px)+14px)*(1-var(--drawer-swipe-progress)))] [--indent-x:0px] [--indent-y:var(--indent-shift)]",
          "data-active:transform-[scale(var(--indent-scale))_translate3d(var(--indent-x),var(--indent-y),0)] data-active:overflow-clip data-active:rounded-[calc(0.5rem*(1-var(--drawer-swipe-progress)))] data-active:will-change-transform",
          // Direction: the origin sits on the drawer's edge and the page shifts away from it.
          "origin-top data-[swipe-direction=up]:origin-bottom data-[swipe-direction=left]:origin-left data-[swipe-direction=right]:origin-right",
          "data-[swipe-direction=up]:[--indent-y:calc(var(--indent-shift)*-1)] data-[swipe-direction=left]:[--indent-x:var(--indent-shift)] data-[swipe-direction=left]:[--indent-y:0px] data-[swipe-direction=right]:[--indent-x:calc(var(--indent-shift)*-1)] data-[swipe-direction=right]:[--indent-y:0px]",
          className,
        )}
        {...props}
      />
    </>
  );
};

const Drawer = ({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean;
}) => {
  useOverlay("Drawer");
  const hasSnapPoints = (snapPoints?.length ?? 0) > 0;

  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = ({ ...props }: DrawerPrimitive.Trigger.Props) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);

const DrawerPortal = ({ ...props }: DrawerPrimitive.Portal.Props) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

const DrawerClose = ({ ...props }: DrawerPrimitive.Close.Props) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
);

const DrawerOverlay = ({ className, ...props }: DrawerPrimitive.Backdrop.Props) => (
  <DrawerPrimitive.Backdrop
    data-slot="drawer-overlay"
    className={cn(
      "fixed inset-0 z-50 min-h-dvh bg-overlay-backdrop opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-backdrop-filter:backdrop-blur-(--overlay-backdrop-blur,2px) supports-[-webkit-touch-callout:none]:absolute",
      className,
    )}
    {...props}
  />
);

const DrawerSwipeHandle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="drawer-swipe-handle"
    aria-hidden="true"
    className={cn(
      "relative z-10 flex shrink-0 cursor-grab rtl:flex-row-reverse touch-none transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-5 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-5 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-input group-data-[swipe-axis=x]/drawer-popup:after:h-12 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-12 active:cursor-grabbing",
      className,
    )}
    {...props}
  />
);

/**
 * Base UI swipe directions are physical (`left` is dismissed by dragging left and exits through
 * the left edge), so the edge positioning below is physical too. Flex rows are reversed in RTL to
 * keep the swipe handle on its physical side; content inside the surface stays logical.
 */
const DrawerPanel = ({
  className,
  children,
  showCloseButton = false,
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) => {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer();
  const { setIndentDirection } = useOverlay("DrawerPanel");
  const swipeAxis = swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";

  React.useLayoutEffect(() => {
    setIndentDirection(swipeDirection);

    return () => {
      setIndentDirection((current) => (current === swipeDirection ? null : current));
    };
  }, [setIndentDirection, swipeDirection]);

  const KeyboardProvider =
    swipeDirection === "down" ? DrawerPrimitive.VirtualKeyboardProvider : React.Fragment;

  return (
    <DrawerPanelContext.Provider value={true}>
      <KeyboardProvider>
        <DrawerPortal data-slot="drawer-portal">
          {modal === true && <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />}
          <DrawerPrimitive.Viewport
            data-slot="drawer-viewport"
            data-modal={modal}
            className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
          >
            <DrawerPrimitive.Popup
              data-slot="drawer-panel"
              data-swipe-axis={swipeAxis}
              data-snap-points={hasSnapPoints ? "" : undefined}
              className={cn(
                // Base.
                "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col surface-modal text-caption text-popover-foreground transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform outline-none select-none [interpolate-size:allow-keywords]",
                // Nested.
                "data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95",
                // Bleed.
                "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-surface-modal)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
                // Sizing.
                "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
                // Stack.
                "[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
                // Transitions.
                "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                // Axis: y.
                "data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
                // Axis: x.
                "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row data-[swipe-axis=x]:rtl:flex-row-reverse",
                // Direction: down.
                "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
                // Direction: up.
                "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
                // Direction: left.
                "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
                // Direction: right.
                "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
                className,
              )}
              {...props}
            >
              {showSwipeHandle && <DrawerSwipeHandle />}
              <div
                data-slot="drawer-surface"
                className={cn(
                  "relative flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] select-text group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none",
                )}
              >
                <ModalHotkeysScope modal={modal}>
                  {children}
                  {showCloseButton && (
                    <DrawerPrimitive.Close
                      data-slot="drawer-close"
                      render={
                        <Button
                          variant="ghost"
                          className="absolute top-2 inset-e-2"
                          size="icon-sm"
                        />
                      }
                    >
                      <Icon name="x" />
                      <span className="sr-only">Close</span>
                    </DrawerPrimitive.Close>
                  )}
                </ModalHotkeysScope>
              </div>
            </DrawerPrimitive.Popup>
          </DrawerPrimitive.Viewport>
        </DrawerPortal>
      </KeyboardProvider>
    </DrawerPanelContext.Provider>
  );
};

const DrawerHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(DrawerPanelContext)) {
    throw new Error("DrawerHeader must be used inside DrawerPanel.");
  }

  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex shrink-0 flex-col gap-related p-panel pb-3 group-data-[swipe-axis=y]/drawer-popup:text-center md:text-start max-sm:pb-4",
        className,
      )}
      {...props}
    />
  );
};

const DrawerContent = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(DrawerPanelContext)) {
    throw new Error("DrawerContent must be used inside DrawerPanel.");
  }

  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      {...props}
    >
      <ScrollArea
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        fade="vertical"
        scrollbar="thin"
        viewportClassName="min-h-0 flex-1 overscroll-contain"
        contentClassName={cn(
          "separator-inset p-panel group-has-[[data-slot=drawer-header]]/drawer-popup:pt-1 group-not-has-[[data-slot=drawer-footer]]/drawer-popup:pb-[calc(env(safe-area-inset-bottom,0px)+var(--panel-padding))]",
          className,
        )}
      >
        {children}
      </ScrollArea>
    </DrawerPrimitive.Content>
  );
};

const DrawerFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  if (!React.useContext(DrawerPanelContext)) {
    throw new Error("DrawerFooter must be used inside DrawerPanel.");
  }

  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col-reverse gap-related surface-footer px-panel pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+(--spacing(4)))] sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
};

const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props) => (
  <DrawerPrimitive.Title
    data-slot="drawer-title"
    className={cn("text-subtitle text-foreground", className)}
    {...props}
  />
);

const DrawerDescription = ({ className, ...props }: DrawerPrimitive.Description.Props) => (
  <DrawerPrimitive.Description
    data-slot="drawer-description"
    className={cn("text-caption text-muted-foreground", className)}
    {...props}
  />
);

export {
  Drawer,
  DrawerIndent,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerPanel,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
