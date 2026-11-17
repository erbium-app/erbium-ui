import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erbium/ui/components/tabs";
import type * as React from "react";

export const defaultProps = {
  defaultValue: "one",
  orientation: "horizontal",
} satisfies React.ComponentProps<typeof Tabs>;

export default function TabsPlaygroundExample(
  args: React.ComponentProps<typeof Tabs> = defaultProps,
) {
  return (
    <Tabs {...args} className="w-72">
      <TabsList>
        <TabsTrigger value="one">First</TabsTrigger>
        <TabsTrigger value="two">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
    </Tabs>
  );
}
