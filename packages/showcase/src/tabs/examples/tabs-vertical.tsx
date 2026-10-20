import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export const TabsVertical = () => (
  <Tabs defaultValue="account" orientation="vertical">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
    </TabsList>
  </Tabs>
);
