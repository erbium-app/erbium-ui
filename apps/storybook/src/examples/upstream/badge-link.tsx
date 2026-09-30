import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";

import { Badge } from "@erbium/ui/components/badge";

export function BadgeAsLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <HugeiconsIcon icon={ArrowUpRight01Icon} data-icon="inline-end" />
    </Badge>
  );
}
