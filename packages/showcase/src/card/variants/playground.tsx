import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Card>) => (
  <Card {...args} className="w-80">
    <CardHeader>
      <CardTitle>Card title</CardTitle>
      <CardDescription>Card description</CardDescription>
    </CardHeader>
    <CardContent>Card content</CardContent>
    <CardFooter>Card footer</CardFooter>
  </Card>
);

export default Example;
