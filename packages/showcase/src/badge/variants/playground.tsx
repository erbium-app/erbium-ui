import { Badge } from "@erbium/ui/components/badge";
import type * as React from "react";

export const defaultProps = {
  children: "Badge",
  className: "",
  loading: false,
  variant: "default",
} satisfies React.ComponentProps<typeof Badge>;

export default function BadgePlaygroundExample(
  args: React.ComponentProps<typeof Badge> = defaultProps,
) {
  return <Badge {...args} />;
}
