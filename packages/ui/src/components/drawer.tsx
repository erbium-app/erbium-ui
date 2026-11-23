import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { Icon } from "./icon";
import { ModalHotkeysScope } from "../lib/modal-hotkeys-scope";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

interface DrawerContextProps {
  hasSnapPoints: boolean;
  modal: DrawerPrimitive.Root.Props["modal"];
  showSwipeHandle: boolean;
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

// True below a DrawerProvider, so an inner provider joins the outer one.
const DrawerProviderContext = React.createContext(false);

/**
 * Coordinates every drawer inside it, so a `DrawerIndent` can follow whichever one is open. Mount
 * it once around the app. A nested provider joins the outer one rather than starting its own, so
 * a widget can mount one without hiding its drawers from the app's indent. Drawers work without
 * a provider; only the indent needs it.
 */
const DrawerProvider = ({ children }: DrawerPrimitive.Provider.Props) => {
  const nested = React.use(DrawerProviderContext);

  return (
    <DrawerProviderContext value={true}>
      {nested ? children : <DrawerPrimitive.Provider>{children}</DrawerPrimitive.Provider>}
    </DrawerProviderContext>
  );
};

/*
 * The scroll offset of the page while a drawer opens. A page taller than the viewport scales
 * around, and clips to, the part on screen. The scroll lock moves the offset from the document to
 * the body on platforms with classic scrollbars, so both count. Offsets are read from layout,
 * which the indent's transform does not change.
 */
const measureIndentTop = (indent: HTMLElement) =>
  Math.max(0, window.scrollY + document.body.scrollTop - indent.offsetTop);

/*
 * Holds `--drawer-indent-top` at the offset from the moment a drawer opens until the page has
 * eased back to rest, since the transform contains fixed descendants until then.
 */
const syncIndentTop = (element: HTMLElement) => {
  const setTop = (top: number) => {
    element.style.setProperty("--drawer-indent-top", `${top}px`);
  };

  const resetAtRest = () => {
    if (element.dataset.active === undefined) {
      setTop(0);
    }
  };

  if (element.dataset.active !== undefined) {
    setTop(measureIndentTop(element));

    return;
  }

  // Reading the animations flushes styles, so the transition back to rest is listed.
  const easing = element
    .getAnimations()
    .filter(
      (animation) =>
        animation instanceof CSSTransition && animation.transitionProperty === "transform",
    );

  if (easing.length === 0) {
    resetAtRest();

    return;
  }

  // A cancelled transition leaves the page at rest as well.
  for (const animation of easing) {
    animation.addEventListener("finish", resetAtRest);
    animation.addEventListener("cancel", resetAtRest);
  }
};

const useIndentTop = (indent: React.RefObject<HTMLDivElement | null>) => {
  React.useLayoutEffect(() => {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.target instanceof HTMLElement) {
          syncIndentTop(record.target);
        }
      }
    });

    if (indent.current !== null) {
      observer.observe(indent.current, { attributeFilter: ["data-active"] });
    }

    return () => {
      observer.disconnect();
    };
  }, [indent]);
};

/**
 * Wraps the app's main UI inside a `DrawerProvider`. While any drawer is open the page scales
 * back from the top of the screen, drops by the safe area, and rounds the visible part over a
 * dark layer, easing back to rest as the drawer is swiped away. It works for a page taller than
 * the viewport as well as one that scrolls inside its own container.
 *
 * The transform makes it the containing block for fixed descendants while a drawer is open. Keep
 * fixed chrome outside it, or offset it with `top-(--drawer-indent-top,0px)`, the scroll offset
 * the indent holds until the page is back at rest.
 */
const DrawerIndent = ({ className, ref, ...props }: DrawerPrimitive.Indent.Props) => {
  const indent = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, indent);
  useIndentTop(indent);

  return (
    <>
      <DrawerPrimitive.IndentBackground
        data-slot="drawer-indent-background"
        className={cn(
          // At rest the layer is the page canvas, so overscrolling the document past its edges
          // shows the page colour rather than the dark layer behind an inset page.
          "fixed inset-0 bg-background",
          // It turns dark at once when a drawer opens, and on close holds until the page has
          // eased back over it.
          "transition-[background-color] delay-(--transition-duration-drawer) duration-0 motion-reduce:delay-0 data-active:bg-overlay-base data-active:delay-0",
        )}
      />
      <DrawerPrimitive.Indent
        ref={mergedRef}
        data-slot="drawer-indent"
        className={cn(
          // Base.
          "relative bg-background [--drawer-indent-top:0px]",
          // Motion. The transition is off while a swipe drives the progress. Only the transform
          // eases: the clip window is placed after `data-active` lands, and easing it would sweep
          // it from the top of the document down to the screen.
          "transition-transform duration-[calc(var(--transition-duration-drawer)*var(--indent-transition))] ease-ui-drawer [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))] motion-reduce:transition-none",
          // Inset: scale around the top of the screen, shift down, and round the visible part.
          "origin-[50%_var(--drawer-indent-top)] [--indent-radius:calc(0.75rem*(1-var(--drawer-swipe-progress)))] [--indent-scale:calc(0.94+(0.06*var(--drawer-swipe-progress)))] [--indent-shift:calc((env(safe-area-inset-top,0px)+14px)*(1-var(--drawer-swipe-progress)))]",
          "data-active:transform-[scale(var(--indent-scale))_translate3d(0,var(--indent-shift),0)] data-active:will-change-transform data-active:[clip-path:inset(var(--drawer-indent-top)_0_max(0px,calc(100%-var(--drawer-indent-top)-100lvh))_0_round_var(--indent-radius))]",
          className,
        )}
        {...props}
      />
    </>
  );
};

/**
 * A bottom sheet, dismissed by swiping down. Below a `DrawerProvider`, an open drawer also
 * insets the page wrapped in `DrawerIndent`.
 */
const Drawer = ({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  ...props
}: Omit<DrawerPrimitive.Root.Props, "swipeDirection"> & {
  showSwipeHandle?: boolean;
}) => {
  const hasSnapPoints = (snapPoints?.length ?? 0) > 0;

  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle }),
    [hasSnapPoints, modal, showSwipeHandle],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection="down"
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
      "relative z-10 flex h-5 w-full shrink-0 cursor-grab touch-none items-end justify-center transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 after:block after:h-1 after:w-12 after:shrink-0 after:rounded-full after:bg-input active:cursor-grabbing",
      className,
    )}
    {...props}
  />
);

/**
 * The sheet rises from the bottom edge, stretches across the viewport, and grows with its
 * content up to 6rem short of the top. Nested drawers stack behind the frontmost one.
 */
const DrawerPanel = ({
  className,
  children,
  showCloseButton = false,
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) => {
  const { hasSnapPoints, modal, showSwipeHandle } = useDrawer();

  return (
    <DrawerPanelContext.Provider value={true}>
      <DrawerPrimitive.VirtualKeyboardProvider>
        <DrawerPortal data-slot="drawer-portal">
          {modal === true && <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />}
          <DrawerPrimitive.Viewport
            data-slot="drawer-viewport"
            data-modal={modal}
            className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
          >
            <DrawerPrimitive.Popup
              data-slot="drawer-panel"
              data-snap-points={hasSnapPoints ? "" : undefined}
              className={cn(
                // Base.
                "group/drawer-popup pointer-events-auto fixed inset-x-0 bottom-0 z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height) min-h-0 origin-bottom transform-[translate3d(0,var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col surface-modal text-caption text-popover-foreground transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform outline-none select-none [interpolate-size:allow-keywords]",
                // Nested.
                "data-nested-drawer-open:h-(--stack-height) data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95",
                // Bleed: the face continues below the bottom edge while the sheet overshoots.
                "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-(--bleed) after:bg-(--drawer-bleed-background,var(--color-surface-modal))",
                // Sizing.
                "[--drawer-content-height:var(--drawer-height,auto)] [--drawer-content-max-height:calc(100dvh-6rem)] data-snap-points:[--drawer-content-height:100dvh]",
                // Stack.
                "[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
                // Position: snap point, swipe, and the stack's peek and shrink.
                "[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] [--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
                // Transitions.
                "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
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
                          className="absolute inset-e-2 top-2"
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
      </DrawerPrimitive.VirtualKeyboardProvider>
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
        "flex shrink-0 flex-col gap-related p-panel pb-3 text-center max-sm:pb-4 md:text-start",
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
          "p-panel separator-inset group-not-has-[[data-slot=drawer-footer]]/drawer-popup:pb-[calc(env(safe-area-inset-bottom,0px)+var(--panel-padding))] group-has-[[data-slot=drawer-header]]/drawer-popup:pt-1",
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
  DrawerProvider,
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
