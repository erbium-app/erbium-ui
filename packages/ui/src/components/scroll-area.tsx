import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

type ScrollAreaFade = "vertical" | "horizontal" | false;
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
  "relative flex-1 rounded-full bg-muted-foreground/35 transition-[background-color,transform] duration-200 hover:bg-muted-foreground/55 active:bg-muted-foreground/70 data-scrolling:bg-muted-foreground/60",
  {
    variants: {
      orientation: {
        vertical: "mx-auto w-1.5",
        horizontal: "my-auto h-1.5",
      },
      size: {
        thin: "",
        default: "",
      },
    },
    compoundVariants: [
      { orientation: "vertical", size: "default", className: "w-2" },
      { orientation: "horizontal", size: "default", className: "h-2" },
    ],
  },
);

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
  /** Adds a scroll-aware fade at the edges of the selected axis. */
  fade?: ScrollAreaFade;
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
      {showScrollbar && (
        <ScrollBar
          size={scrollbar}
          visibility={scrollbarVisibility}
          className={scrollbarClassName}
          thumbClassName={thumbClassName}
        />
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
        "flex touch-none select-none transition-opacity duration-200 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
        "data-[visibility=hover]:opacity-0 data-[visibility=hover]:data-hovering:opacity-100 data-[visibility=scroll]:opacity-0 data-[visibility=scroll]:data-scrolling:opacity-100",
        "data-[size=default]:data-[orientation=horizontal]:h-2.5 data-[size=default]:data-[orientation=vertical]:w-2.5",
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

export type { ScrollAreaFade, ScrollBarSize, ScrollBarVisibility };
