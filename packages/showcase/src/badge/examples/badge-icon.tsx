import { Icon } from "@erbium/ui/components/icon";

import { Badge } from "@erbium/ui/components/badge";

export const BadgeWithIconLeft = () => (
  <div className="flex flex-wrap gap-related">
    <Badge variant="success" statusIcon>
      Verified
    </Badge>
    <Badge variant="outline">
      Bookmark
      <Icon name="bookmark-01" data-icon="inline-end" />
    </Badge>
  </div>
);
