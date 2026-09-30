import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "../lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
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
        "relative isolate inline-flex h-8 w-fit items-center justify-center rounded-lg bg-surface-well p-[3px] text-muted-foreground shadow-well group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
        className,
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="pointer-events-none absolute top-0 left-0 z-0 rounded-md border border-surface-rim bg-surface-control shadow-control"
        render={(indicatorProps, state) => (
          <motion.span
            {...(indicatorProps as HTMLMotionProps<"span">)}
            initial={false}
            animate={{
              x: state.activeTabPosition?.left ?? 0,
              y: state.activeTabPosition?.top ?? 0,
              width: state.activeTabSize?.width ?? 0,
              height: state.activeTabSize?.height ?? 0,
            }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 35 }
            }
          />
        )}
      />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring data-active:text-foreground has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
