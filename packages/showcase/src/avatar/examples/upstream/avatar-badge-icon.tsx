import { HugeiconsIcon } from "@hugeicons/react";
import PlusIcon from "@hugeicons/core-free-icons/PlusIcon";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";

export function AvatarBadgeIconExample() {
  return (
    <Avatar className="grayscale">
      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <HugeiconsIcon icon={PlusIcon} />
      </AvatarBadge>
    </Avatar>
  );
}
