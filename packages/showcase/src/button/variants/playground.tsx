import { Icon } from "@erbium/ui/components/icon";
import { Button } from "@erbium/ui/components/button";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Button>) => {
  const iconOnly = typeof args.size === "string" && args.size.startsWith("icon");

  return (
    <Button {...args} aria-label={iconOnly ? "Submit" : undefined}>
      {iconOnly ? <Icon name="arrow-up-01" /> : "Button"}
    </Button>
  );
};

export default Example;
