import { HugeiconsIcon } from "@hugeicons/react";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import RefreshCcwIcon from "@hugeicons/core-free-icons/RefreshCcwIcon";

import { Button } from "@erbium/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@erbium/ui/components/empty";

export function EmptyMuted() {
  return (
    <Empty className="h-full bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={BellIcon} />
        </EmptyMedia>
        <EmptyTitle>No Notifications</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          You&apos;re all caught up. New notifications will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <HugeiconsIcon icon={RefreshCcwIcon} data-icon="inline-start" />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}
