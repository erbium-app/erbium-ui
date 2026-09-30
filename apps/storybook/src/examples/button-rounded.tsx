import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonRounded() {
  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="icon" className="rounded-full">
        <HugeiconsIcon icon={ArrowUp01Icon} />
      </Button>
    </div>
  );
}
