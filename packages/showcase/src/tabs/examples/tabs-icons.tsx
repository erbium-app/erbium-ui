import { Icon } from "@erbium/ui/components/icon";

import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export default function TabsIconsExample() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <Icon name="app-window" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <Icon name="code" />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
