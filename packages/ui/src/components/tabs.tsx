import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../lib/utils";
import {
  segmentedIndicatorClass,
  segmentedItemClass,
  segmentedTrackClass,
} from "./segmented-control";

const Tabs = ({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    data-orientation={orientation}
    orientation={orientation}
    className={cn("group/tabs flex gap-related data-horizontal:flex-col", className)}
    {...props}
  />
);

const TabsList = ({ className, children, ...props }: TabsPrimitive.List.Props) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      segmentedTrackClass,
      "group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
      className,
    )}
    {...props}
  >
    {children}
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      // Base UI measures the active tab relative to this list, so a CSS transition on those
      // values moves the indicator only within the list. A page-level layout animation would
      // also replay every shift of the list itself, such as content above it changing height.
      className={cn(
        segmentedIndicatorClass,
        "h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top)",
      )}
    />
  </TabsPrimitive.List>
);

const TabsTrigger = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    data-slot="tabs-trigger"
    className={cn(
      segmentedItemClass,
      "flex-1 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start data-active:text-foreground",
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
