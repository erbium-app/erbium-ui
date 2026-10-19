import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "../lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-related data-horizontal:flex-col", className)}
      {...props}
    />
  );
}

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative isolate inline-flex min-h-control control-adaptive w-fit items-center justify-center rounded-lg surface-well p-0.75 text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
        className,
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="pointer-events-none absolute top-0 left-0 z-0 rounded-md border surface-control"
        render={(indicatorProps, state) => {
          const position = state.activeTabPosition;
          const size = state.activeTabSize;

          if (!position || !size || size.width === 0 || size.height === 0) {
            return <span {...indicatorProps} />;
          }

          return (
            <motion.span
              {...(indicatorProps as HTMLMotionProps<"span">)}
              initial={false}
              animate={{
                height: size.height,
                width: size.width,
                x: position.left,
                y: position.top,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { damping: 35, stiffness: 400, type: "spring" }
              }
            />
          );
        }}
      />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex segmented-size flex-1 items-center justify-center gap-control-gap rounded-md border border-transparent bg-transparent px-control-inset py-0 text-control-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring data-active:text-foreground has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-control outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
