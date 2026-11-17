import { Toggle } from "@erbium/ui/components/toggle";
import type * as React from "react";

export const defaultProps = {
  className: "",
  defaultPressed: false,
  size: "default",
  variant: "default",
} satisfies React.ComponentProps<typeof Toggle>;

export default function TogglePlaygroundExample(
  args: React.ComponentProps<typeof Toggle> = defaultProps,
) {
  return <Toggle {...args}>Toggle</Toggle>;
}
