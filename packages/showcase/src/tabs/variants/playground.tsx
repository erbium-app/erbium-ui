import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erbium/ui/components/tabs";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Tabs>) => (
  <Tabs key={args.defaultValue} {...args} className="w-72">
    <TabsList>
      <TabsTrigger value="one">First</TabsTrigger>
      <TabsTrigger value="two">Second</TabsTrigger>
    </TabsList>
    <TabsContent value="one">First panel</TabsContent>
    <TabsContent value="two">Second panel</TabsContent>
  </Tabs>
);

export default Example;
