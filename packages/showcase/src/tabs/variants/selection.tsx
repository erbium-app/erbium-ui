import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

const Example = () => (
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="reports">Reports</TabsTrigger>
    </TabsList>
  </Tabs>
);

export default Example;
