import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useHotkey } from "@tanstack/react-hotkeys";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { useIsMobile } from "../hooks/use-is-mobile";
import { toAriaKeyShortcuts, useHotkeyPlatform } from "../lib/hotkeys";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { KbdHint } from "./kbd";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { Sheet, SheetPanel, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { SidebarToggleIcon } from "./stateful-icon";

const SIDEBAR_KEYBOARD_SHORTCUT = "Mod+B";

// Resize bounds in pixels. Dragging the rail below half the minimum collapses the sidebar.
const SIDEBAR_MIN_WIDTH = 224;
const SIDEBAR_MAX_WIDTH = 352;

// How far one arrow key press moves a focused rail, and how far the pointer travels before a
// press on the rail becomes a drag instead of a click.
const SIDEBAR_RESIZE_STEP = 16;
const SIDEBAR_DRAG_THRESHOLD = 4;

const sidebarGapVariants = cva(
  "relative w-(--sidebar-width) bg-transparent transition-[width] duration-panel ease-ui-out group-data-resizing/sidebar-wrapper:transition-none group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        inset: "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
        sidebar: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
      },
    },
  },
);

const sidebarContainerVariants = cva(
  "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-panel ease-ui-out group-data-resizing/sidebar-wrapper:transition-none data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:-left-(--sidebar-width) data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:-right-(--sidebar-width) motion-reduce:transition-none md:flex",
  {
    variants: {
      variant: {
        inset:
          "p-(--sidebar-inset-gap) group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
        sidebar:
          "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",
      },
    },
  },
);

const sidebarStyles = {
  group: "relative flex w-full min-w-0 flex-col p-2",
  groupContent: "w-full text-control-sm",
  groupLabel:
    "flex min-h-control shrink-0 items-center rounded-md px-2 text-control-sm text-muted-foreground outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-[margin,opacity] duration-ui ease-ui-out group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0",
  header: "flex flex-col gap-related p-2",
  menu: "flex w-full min-w-0 flex-col gap-0",
  menuItem: "group/menu-item relative",
} as const;

// Router links mark the current page with `aria-current="page"`, which styles the active row.
const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center overflow-hidden rounded-md text-start text-control-sm outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-sidebar-size group-has-data-[slot=sidebar-menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-control! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground [&_svg]:size-control-icon [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "control-size touch-target text-control-sm",
        lg: "control-size-lg touch-target [&_svg]:size-control-icon-lg text-control group-data-[collapsible=icon]:p-0!",
        sm: "control-size-sm touch-target text-control-sm [&_svg]:size-control-icon-sm",
      },
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-sidebar-outline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sidebar-outline-hover",
      },
    },
  },
);

interface SidebarContextProps {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  /** Width in pixels set by resizing. `undefined` keeps the width from `--sidebar-width`. */
  width: number | undefined;
  setWidth: (width: number | undefined) => void;
  minWidth: number;
  maxWidth: number;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};

const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  defaultWidth,
  width: widthProp,
  onWidthChange,
  minWidth = SIDEBAR_MIN_WIDTH,
  maxWidth = SIDEBAR_MAX_WIDTH,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Initial width in pixels. Leave unset to use `--sidebar-width`. */
  defaultWidth?: number;
  /** Controlled width in pixels; `undefined` falls back to `--sidebar-width`. */
  width?: number;
  onWidthChange?: (width: number | undefined) => void;
  /** Smallest width the rail can resize to, in pixels. */
  minWidth?: number;
  /** Largest width the rail can resize to, in pixels. */
  maxWidth?: number;
}) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (openState: boolean) => {
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        setUncontrolledOpen(openState);
      }
    },
    [setOpenProp],
  );

  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(defaultWidth);
  const width = onWidthChange ? widthProp : (widthProp ?? uncontrolledWidth);

  const setWidth = React.useCallback(
    (nextWidth: number | undefined) => {
      if (onWidthChange) {
        onWidthChange(nextWidth);
      } else {
        setUncontrolledWidth(nextWidth);
      }
    },
    [onWidthChange],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, setOpen, setOpenMobile]);

  // Toggle the sidebar with Mod+B (Cmd+B on macOS, Ctrl+B elsewhere).
  // `allow` keeps multiple providers from warning when several sidebars coexist.
  useHotkey(SIDEBAR_KEYBOARD_SHORTCUT, toggleSidebar, {
    conflictBehavior: "allow",
    meta: { name: "Toggle sidebar" },
  });

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      isMobile,
      maxWidth,
      minWidth,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      setWidth,
      state,
      toggleSidebar,
      width,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      width,
      setWidth,
      minWidth,
      maxWidth,
    ],
  );

  const widthStyle: CSSVariableStyle = { "--sidebar-width": `${width}px` };
  const wrapperStyle = width === undefined ? style : { ...style, ...widthStyle };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        // Override a width with a class, e.g. `[--sidebar-width:20rem]`; `cn` keeps the last one.
        // `--sidebar-inset-gap` spaces an inset sidebar and its surface from the viewport edges.
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full [--sidebar-inset-gap:--spacing(2)] [--sidebar-width-icon:3rem] [--sidebar-width:16rem] has-data-[variant=inset]:bg-sidebar data-resizing:cursor-ew-resize data-resizing:select-none",
          className,
        )}
        style={wrapperStyle}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

/* The mobile sheet suspends the provider's shortcut while it is open, so the sheet registers
   it again to close itself with the same keys. */
const SidebarSheetHotkey = ({ onClose }: { onClose: () => void }) => {
  useHotkey(SIDEBAR_KEYBOARD_SHORTCUT, onClose, { meta: { name: "Close sidebar" } });

  return null;
};

const Sidebar = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetPanel
          dir={dir}
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground duration-ui-slow ease-ui-drawer [--sidebar-width:18rem] [&>button]:hidden"
          side={side}
        >
          <SidebarSheetHotkey
            onClose={() => {
              setOpenMobile(false);
            }}
          />
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
        </SheetPanel>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div data-slot="sidebar-gap" className={cn(sidebarGapVariants({ variant }))} />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(sidebarContainerVariants({ className, variant }))}
        {...props}
      >
        <div data-slot="sidebar-inner" className="flex size-full flex-col bg-sidebar">
          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarTrigger = ({
  className,
  onClick,
  children,
  side = "left",
  ...props
}: React.ComponentProps<typeof Button> & { side?: "left" | "right" }) => {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;
  const platform = useHotkeyPlatform();

  // The provider registers the shortcut, so the trigger only announces and reveals it.
  return (
    <Button
      aria-expanded={isOpen}
      aria-keyshortcuts={toAriaKeyShortcuts(SIDEBAR_KEYBOARD_SHORTCUT, platform)}
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn("relative", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <SidebarToggleIcon isOpen={isOpen} side={side} className="rtl:rotate-180" />
      {children ?? <span className="sr-only">Toggle Sidebar</span>}
      <KbdHint hotkey={SIDEBAR_KEYBOARD_SHORTCUT} />
    </Button>
  );
};

const clampWidth = (width: number, minWidth: number, maxWidth: number) =>
  Math.min(Math.max(width, minWidth), maxWidth);

interface RailDrag {
  pointerId: number;
  startX: number;
  startWidth: number;
  // 1 when dragging right widens the sidebar (left side), -1 when it narrows it (right side).
  direction: 1 | -1;
  wrapper: HTMLElement;
  moved: boolean;
  open: boolean;
  width: number;
}

const railElements = (rail: HTMLElement) => ({
  container: rail.closest<HTMLElement>('[data-slot="sidebar-container"]'),
  wrapper: rail.closest<HTMLElement>('[data-slot="sidebar-wrapper"]'),
});

const railSide = (rail: HTMLElement): 1 | -1 =>
  railElements(rail).container?.dataset.side === "right" ? -1 : 1;

/**
 * The sidebar's edge. Dragging it resizes the sidebar between `minWidth` and `maxWidth`, and
 * dragging past half the minimum collapses it; dragging a collapsed sidebar's edge opens it
 * again. A click toggles the sidebar. Focused, it follows the window splitter pattern: arrow
 * keys resize, Home and End jump to the bounds, and Enter toggles.
 */
const SidebarRail = ({
  className,
  onClick,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen, toggleSidebar, width, setWidth, minWidth, maxWidth } = useSidebar();
  const drag = React.useRef<RailDrag | null>(null);
  const suppressClick = React.useRef(false);
  const railRef = React.useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = React.useState<number>();

  // Assistive technology hears the width before the first resize too, when only CSS sets it.
  React.useLayoutEffect(() => {
    const container = railRef.current && railElements(railRef.current).container;

    if (container) {
      setMeasuredWidth(Math.round(container.getBoundingClientRect().width));
    }
  }, []);

  const currentWidth = width ?? measuredWidth ?? minWidth;

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = drag.current;

    if (!active || active.pointerId !== event.pointerId) {
      return;
    }

    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    delete active.wrapper.dataset.resizing;

    if (active.moved) {
      suppressClick.current = true;

      if (active.open) {
        setWidth(active.width);
      }
    }
  };

  const resizeBy = (direction: 1 | -1, delta: number) => {
    if (!open) {
      if (delta * direction > 0) {
        setOpen(true);
      }

      return;
    }

    setWidth(clampWidth(currentWidth + delta * direction, minWidth, maxWidth));
  };

  return (
    <div
      ref={railRef}
      // A focusable window splitter: `hr` is a non-interactive thematic break and cannot take
      // focus, pointer capture, or the resize handlers.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      aria-valuenow={open ? currentWidth : 0}
      aria-valuetext={open ? `${currentWidth} pixels` : "Collapsed"}
      tabIndex={0}
      data-slot="sidebar-rail"
      title="Drag to resize, click to toggle"
      onClick={(event) => {
        onClick?.(event);

        if (suppressClick.current) {
          suppressClick.current = false;

          return;
        }

        toggleSidebar();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const direction = railSide(event.currentTarget);
        // Arrow keys are physical: the side's own arrow narrows the sidebar.
        const step = event.shiftKey ? SIDEBAR_RESIZE_STEP * 4 : SIDEBAR_RESIZE_STEP;

        switch (event.key) {
          case "ArrowRight": {
            resizeBy(direction, step);
            break;
          }

          case "ArrowLeft": {
            resizeBy(direction, -step);
            break;
          }

          case "Home": {
            setWidth(minWidth);
            break;
          }

          case "End": {
            setWidth(maxWidth);
            break;
          }

          case "Enter": {
            toggleSidebar();
            break;
          }

          default: {
            return;
          }
        }

        event.preventDefault();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);

        if (event.defaultPrevented || event.button !== 0) {
          return;
        }

        const { container, wrapper } = railElements(event.currentTarget);

        if (!container || !wrapper) {
          return;
        }

        const startWidth = open ? container.getBoundingClientRect().width : 0;

        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          direction: railSide(event.currentTarget),
          moved: false,
          open,
          pointerId: event.pointerId,
          startWidth,
          startX: event.clientX,
          width: startWidth,
          wrapper,
        };
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);

        const active = drag.current;

        if (!active || active.pointerId !== event.pointerId) {
          return;
        }

        const delta = (event.clientX - active.startX) * active.direction;

        if (!active.moved) {
          if (Math.abs(delta) < SIDEBAR_DRAG_THRESHOLD) {
            return;
          }

          active.moved = true;
          active.wrapper.dataset.resizing = "";
        }

        const next = active.startWidth + delta;

        if (next < minWidth / 2) {
          if (active.open) {
            active.open = false;
            setOpen(false);
          }

          return;
        }

        if (!active.open) {
          active.open = true;
          setOpen(true);
        }

        // Write the width straight to the wrapper while dragging, so a drag does not re-render
        // every sidebar consumer on each pointer move. The provider's state follows on release.
        active.width = clampWidth(next, minWidth, maxWidth);
        active.wrapper.style.setProperty("--sidebar-width", `${active.width}px`);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        finishDrag(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        finishDrag(event);
      }}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 touch-none outline-none transition-all duration-panel ease-ui-out motion-reduce:transition-none group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 hover:after:bg-sidebar-border focus-visible:after:bg-ring sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "cursor-ew-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 rtl:group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:inset-s-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-inset-e-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-inset-s-2",
        "group-data-resizing/sidebar-wrapper:after:bg-ring",
        className,
      )}
      {...props}
    />
  );
};

/*
 * The main content beside the sidebar. Beside a plain sidebar it shares the page background.
 * Beside an inset sidebar it is the raised content panel: `surface-panel` gives it the panel
 * face, perimeter, catchlight, and drop shadow above the sidebar's canvas, in both themes.
 */
const SidebarInset = ({ className, ...props }: React.ComponentProps<"main">) => (
  <main
    data-slot="sidebar-inset"
    className={cn(
      "relative flex w-full flex-1 flex-col bg-background transition-[margin] duration-panel ease-ui-out group-data-resizing/sidebar-wrapper:transition-none motion-reduce:transition-none md:peer-data-[variant=inset]:m-(--sidebar-inset-gap) md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:surface-panel md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-(--sidebar-inset-gap)",
      className,
    )}
    {...props}
  />
);

const SidebarInput = ({ className, ...props }: React.ComponentProps<typeof Input>) => (
  <Input data-slot="sidebar-input" className={cn("min-h-control w-full", className)} {...props} />
);

const SidebarHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="sidebar-header" className={cn(sidebarStyles.header, className)} {...props} />
);

const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sidebar-footer"
    className={cn(sidebarStyles.header, "carve-top", className)}
    {...props}
  />
);

const SidebarSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="sidebar-separator"
    variant="inset"
    className={cn("mx-2 w-auto", className)}
    {...props}
  />
);

const SidebarContent = ({
  className,
  children,
  scrollbar = "thin",
  ...props
}: React.ComponentProps<"div"> & {
  scrollbar?: React.ComponentProps<typeof ScrollArea>["scrollbar"];
}) => (
  <ScrollArea
    className="min-h-0 flex-1"
    viewportClassName="overflow-x-hidden!"
    viewportRender={
      <div
        data-slot="sidebar-content"
        className={cn("min-h-0 flex-1 group-data-[collapsible=icon]:overflow-hidden!", className)}
        {...props}
      />
    }
    contentClassName="flex flex-col gap-0"
    fade="vertical"
    scrollbar={scrollbar}
  >
    {children}
  </ScrollArea>
);

const SidebarGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="sidebar-group" className={cn(sidebarStyles.group, className)} {...props} />
);

const SidebarGroupLabel = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(sidebarStyles.groupLabel, className),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-label",
    },
  });

const SidebarGroupAction = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">) =>
  useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-3.5 end-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-action",
    },
  });

const SidebarGroupContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sidebar-group-content"
    className={cn(sidebarStyles.groupContent, className)}
    {...props}
  />
);

const SidebarMenu = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul data-slot="sidebar-menu" className={cn(sidebarStyles.menu, className)} {...props} />
);

const SidebarMenuItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li data-slot="sidebar-menu-item" className={cn(sidebarStyles.menuItem, className)} {...props} />
);

const SidebarMenuButton = ({
  render,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>) => {
  const { isMobile, state } = useSidebar();
  const hasTooltip = tooltip !== undefined && tooltip !== "";

  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ size, variant }), className),
      },
      props,
    ),
    render: hasTooltip ? <TooltipTrigger render={render} /> : render,
    state: {
      size,
      slot: "sidebar-menu-button",
    },
  });

  if (!hasTooltip) {
    return comp;
  }

  // A string tooltip is shorthand for its content.
  const tooltipProps = tooltip instanceof Object ? tooltip : { children: tooltip };

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  );
};

const SidebarMenuAction = ({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean;
  }) =>
  useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-1.5 end-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-aria-[current=page]/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
    },
  });

const SidebarMenuBadge = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sidebar-menu-badge"
    className={cn(
      "pointer-events-none absolute inset-e-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-control-sm text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-aria-[current=page]/menu-button:text-sidebar-accent-foreground",
      className,
    )}
    {...props}
  />
);

const SidebarMenuSkeleton = ({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) => {
  // A width between 50 and 90% that varies per skeleton. Derived from the stable id rather
  // than Math.random, so the server and client render the same width.
  const id = React.useId();
  let seed = 0;

  for (const character of id) {
    seed += character.codePointAt(0) ?? 0;
  }

  const skeletonStyle: CSSVariableStyle = { "--skeleton-width": `${50 + (seed % 40)}%` };

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn("flex min-h-control items-center gap-related rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton className="h-4 max-w-(--skeleton-width) flex-1" style={skeletonStyle} />
    </div>
  );
};

const SidebarMenuSub = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul
    data-slot="sidebar-menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px rtl:-translate-x-px flex-col gap-1 carve-start px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
);

const SidebarMenuSubItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li
    data-slot="sidebar-menu-sub-item"
    className={cn("group/menu-sub-item relative", className)}
    {...props}
  />
);

const SidebarMenuSubButton = ({
  render,
  size = "md",
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md";
  }) =>
  useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "flex min-h-control-sm min-w-0 -translate-x-px rtl:translate-x-px items-center gap-related overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-control data-[size=sm]:text-control-sm aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      size,
      slot: "sidebar-menu-sub-button",
    },
  });

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
