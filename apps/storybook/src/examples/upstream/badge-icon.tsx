import { HugeiconsIcon } from "@hugeicons/react";
import BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";
import Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";

import { Badge } from "@erbium/ui/components/badge";

export function BadgeWithIconLeft() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <HugeiconsIcon icon={BadgeCheckIcon} data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <HugeiconsIcon icon={Bookmark01Icon} data-icon="inline-end" />
      </Badge>
    </div>
  );
}
