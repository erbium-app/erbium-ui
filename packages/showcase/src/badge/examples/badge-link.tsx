import { Icon } from "@erbium/ui/components/icon";

import { Badge } from "@erbium/ui/components/badge";

export function BadgeAsLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <Icon name="arrow-up-right-01" data-icon="inline-end" />
    </Badge>
  );
}
