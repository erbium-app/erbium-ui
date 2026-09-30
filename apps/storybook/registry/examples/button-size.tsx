// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";

import { Button } from "../components/button";

export default function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="icon-sm" aria-label="Submit" variant="outline">
          <HugeiconsIcon icon={ArrowUpRight01Icon} />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline">Default</Button>
        <Button size="icon" aria-label="Submit" variant="outline">
          <HugeiconsIcon icon={ArrowUpRight01Icon} />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button size="icon-lg" aria-label="Submit" variant="outline">
          <HugeiconsIcon icon={ArrowUpRight01Icon} />
        </Button>
      </div>
    </div>
  );
}
