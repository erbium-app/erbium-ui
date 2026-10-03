import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <HugeiconsIcon icon={ArrowUp01Icon} />
      </Button>
    </div>
  );
}
