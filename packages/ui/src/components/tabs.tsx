import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { domMax, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "../lib/utils";

const Tabs = ({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    data-orientation={orientation}
    orientation={orientation}
    className={cn("group/tabs flex gap-related data-horizontal:flex-col", className)}
    {...props}
  />
);

const TabsList = ({ className, children, ...props }: TabsPrimitive.List.Props) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative isolate inline-flex min-h-control w-fit items-center justify-center rounded-lg surface-well p-0.75 text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
        className,
      )}
      {...props}
    >
      {children}
      <LazyMotion features={domMax}>
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          // Base UI places the indicator over the active tab through these variables; Motion's
          // layout animation then moves and resizes it with transforms.
          className="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) z-0 h-(--active-tab-height) w-(--active-tab-width) rounded-md border surface-control"
          render={(indicatorProps) => {
            /* Motion owns these handler names with different signatures; the
               indicator never receives them, so they are dropped. */
            const {
              onAnimationStart: _onAnimationStart,
              onDrag: _onDrag,
              onDragEnd: _onDragEnd,
              onDragStart: _onDragStart,
              ...motionProps
            } = indicatorProps;

            return (
              <m.span
                {...motionProps}
                layout={shouldReduceMotion !== true}
                transition={{ damping: 35, stiffness: 400, type: "spring" }}
              />
            );
          }}
        />
      </LazyMotion>
    </TabsPrimitive.List>
  );
};

const TabsTrigger = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    data-slot="tabs-trigger"
    className={cn(
      "relative z-10 inline-flex segmented-size flex-1 items-center justify-center gap-control-gap rounded-md border border-transparent bg-transparent px-control-inset py-0 text-control-sm whitespace-nowrap text-muted-foreground transition-colors duration-150 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50 data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: TabsPrimitive.Panel.Props) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn("flex-1 text-control outline-none", className)}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
