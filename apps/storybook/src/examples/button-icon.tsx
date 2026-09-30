import { HugeiconsIcon } from "@hugeicons/react";
import CircleFadingArrowUpIcon from "@hugeicons/core-free-icons/CircleFadingArrowUpIcon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <HugeiconsIcon icon={CircleFadingArrowUpIcon} />
    </Button>
  );
}
