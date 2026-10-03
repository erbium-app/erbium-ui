import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof ToggleGroup>) => (
  <ToggleGroup {...args}>
    <ToggleGroupItem value="one">One</ToggleGroupItem>
    <ToggleGroupItem value="two">Two</ToggleGroupItem>
    <ToggleGroupItem value="three">Three</ToggleGroupItem>
  </ToggleGroup>
);

export default Example;
