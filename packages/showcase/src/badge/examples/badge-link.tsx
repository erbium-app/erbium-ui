import { Icon } from "@erbium/ui/components/icon";

import { Badge } from "@erbium/ui/components/badge";

export default function BadgeAsLinkExample() {
  return (
    <Badge aria-label="Choose option" render={<a aria-label="View details" href="#link" />}>
      Open Link <Icon name="arrow-up-right-01" data-icon="inline-end" />
    </Badge>
  );
}
