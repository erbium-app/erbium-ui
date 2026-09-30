import { HugeiconsIcon } from "@hugeicons/react";
import Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";

import { Badge } from "@erbium/ui/components/badge";

export function BadgeWithIconLeft() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" statusIcon>
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <HugeiconsIcon icon={Bookmark01Icon} data-icon="inline-end" />
      </Badge>
    </div>
  );
}
