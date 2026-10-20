import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export const TabsDisabled = () => (
  <Tabs defaultValue="home">
    <TabsList>
      <TabsTrigger value="home">Home</TabsTrigger>
      <TabsTrigger value="settings" disabled>
        Disabled
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
