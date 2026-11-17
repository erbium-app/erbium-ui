import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import type * as React from "react";

export const defaultProps = { size: "default" } satisfies React.ComponentProps<typeof Card>;

export default function CardPlaygroundExample(
  args: React.ComponentProps<typeof Card> = defaultProps,
) {
  return (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>Card content</CardContent>
      <CardFooter>Card footer</CardFooter>
    </Card>
  );
}
