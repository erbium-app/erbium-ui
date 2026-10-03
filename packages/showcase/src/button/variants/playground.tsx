import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
import { Button } from "@erbium/ui/components/button";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Button>) => {
  const iconOnly = typeof args.size === "string" && args.size.startsWith("icon");

  return (
    <Button {...args} aria-label={iconOnly ? "Submit" : undefined}>
      {iconOnly ? <HugeiconsIcon icon={ArrowUp01Icon} /> : "Button"}
    </Button>
  );
};

export default Example;
