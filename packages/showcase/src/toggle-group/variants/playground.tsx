import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import type * as React from "react";

export const defaultProps = {
  multiple: false,
  orientation: "horizontal",
  size: "default",
  spacing: 2,
  variant: "default",
} satisfies React.ComponentProps<typeof ToggleGroup>;

export default function ToggleGroupPlaygroundExample(
  args: React.ComponentProps<typeof ToggleGroup> = defaultProps,
) {
  return (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="one">One</ToggleGroupItem>
      <ToggleGroupItem value="two">Two</ToggleGroupItem>
      <ToggleGroupItem value="three">Three</ToggleGroupItem>
    </ToggleGroup>
  );
}
