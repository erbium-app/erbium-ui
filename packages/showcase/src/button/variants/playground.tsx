import { Icon } from "@erbium/ui/components/icon";
import { Button } from "@erbium/ui/components/button";
import type * as React from "react";

export const defaultProps = {
  loading: false,
  size: "default",
  variant: "default",
} satisfies React.ComponentProps<typeof Button>;

export default function ButtonPlaygroundExample(
  args: React.ComponentProps<typeof Button> = defaultProps,
) {
  const iconOnly = args.size?.startsWith("icon") === true;

  return (
    <Button {...args} aria-label={iconOnly ? "Submit" : undefined}>
      {iconOnly ? <Icon name="arrow-up-01" /> : "Button"}
    </Button>
  );
}
