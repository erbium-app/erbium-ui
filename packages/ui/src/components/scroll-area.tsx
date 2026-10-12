import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

type ScrollAreaFade = "vertical" | "horizontal" | false;
type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
type ScrollBarSize = "thin" | "default";
type ScrollBarVisibility = "always" | "hover" | "scroll";

const scrollAreaViewportVariants = cva(
  "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:outline-1",
  {
    variants: {
      fade: {
        vertical: "data-has-overflow-y:scroll-fade-y",
        horizontal: "data-has-overflow-x:scroll-fade-x",
        none: "",
      },
    },
  },
);

const scrollBarThumbVariants = cva(
  "relative rounded-full bg-scrollbar-thumb transition-[background-color,transform] duration-200 hover:bg-scrollbar-thumb-hover active:bg-scrollbar-thumb-active data-scrolling:bg-scrollbar-thumb-scrolling forced-colors:bg-[ButtonText]",
  {
    variants: {
      orientation: {
        vertical: "mx-auto w-scrollbar-thumb",
        horizontal: "my-auto h-scrollbar-thumb",
      },
      size: {
        thin: "",
        default: "",
      },
    },
    compoundVariants: [
      { orientation: "vertical", size: "default", className: "w-scrollbar-thumb-default" },
      { orientation: "horizontal", size: "default", className: "h-scrollbar-thumb-default" },
    ],
  },
);

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  /** Adds a scroll-aware fade at the edges of the selected axis. */
  fade?: ScrollAreaFade;
  /**
   * Which axes get a custom scrollbar. Defaults to vertical so popups that clip
   * horizontal overflow (`overflow-x-hidden!`) don't show a dead horizontal bar;
   * opt into `horizontal` or `both` for content that genuinely scrolls sideways.
   */
  orientation?: ScrollAreaOrientation;
  /** Controls the visual size of the custom scrollbar. */
  scrollbar?: ScrollBarSize | "none";
  /** Controls when the custom scrollbar is visible. */
  scrollbarVisibility?: ScrollBarVisibility;
  viewportClassName?: string;
  viewportRole?: React.AriaRole;
  viewportRender?: ScrollAreaPrimitive.Viewport.Props["render"];
  contentClassName?: string;
  scrollbarClassName?: string;
  thumbClassName?: string;
};

function ScrollArea({
  className,
  children,
  fade = "vertical",
  orientation = "vertical",
  scrollbar = "thin",
  scrollbarVisibility = "always",
  viewportClassName,
  viewportRole,
  viewportRender,
  contentClassName,
  scrollbarClassName,
  thumbClassName,
  ...props
}: ScrollAreaProps) {
  const showScrollbar = scrollbar !== "none";

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      data-scrollbar-size={scrollbar}
      data-scrollbar-visibility={scrollbarVisibility}
      className={cn("group/scroll-area relative", className)}
      {...props}
    >
      <ScrollAreaViewport
        data-slot="scroll-area-viewport"
        role={viewportRole}
        render={viewportRender}
        className={scrollAreaViewportVariants({
          fade: fade || "none",
          className: viewportClassName,
        })}
      >
        <ScrollAreaContent className={contentClassName}>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      {showScrollbar &&
        (orientation === "both" ? (["vertical", "horizontal"] as const) : [orientation]).map(
          (axis) => (
            <ScrollBar
              key={axis}
              orientation={axis}
              size={scrollbar}
              visibility={scrollbarVisibility}
              className={scrollbarClassName}
              thumbClassName={thumbClassName}
            />
          ),
        )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollAreaViewport({ className, ...props }: ScrollAreaPrimitive.Viewport.Props) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn("size-full", className)}
      {...props}
    />
  );
}

function ScrollAreaContent({ className, ...props }: ScrollAreaPrimitive.Content.Props) {
  return (
    <ScrollAreaPrimitive.Content
      data-slot="scroll-area-content"
      className={cn("min-w-full", className)}
      {...props}
    />
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  size = "thin",
  visibility = "always",
  thumbClassName,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & {
  size?: ScrollBarSize;
  visibility?: ScrollBarVisibility;
  thumbClassName?: string;
}) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      data-size={size}
      data-visibility={visibility}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-opacity duration-200 data-[orientation=horizontal]:h-scrollbar-track data-[orientation=horizontal]:flex-col data-[orientation=vertical]:h-full data-[orientation=vertical]:w-scrollbar-track",
        "data-[visibility=hover]:opacity-0 data-[visibility=hover]:data-hovering:opacity-100 data-[visibility=scroll]:opacity-0 data-[visibility=scroll]:data-scrolling:opacity-100",
        "data-[size=default]:data-[orientation=horizontal]:h-scrollbar-track-default data-[size=default]:data-[orientation=vertical]:w-scrollbar-track-default",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(scrollBarThumbVariants({ orientation, size, className: thumbClassName }))}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollAreaContent, ScrollAreaViewport, ScrollBar };

export type { ScrollAreaFade, ScrollAreaOrientation, ScrollBarSize, ScrollBarVisibility };
