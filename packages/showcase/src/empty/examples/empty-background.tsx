import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@erbium/ui/components/empty";

export const EmptyMuted = () => (
  <Empty className="h-full bg-muted/30">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Icon name="bell" />
      </EmptyMedia>
      <EmptyTitle>No Notifications</EmptyTitle>
      <EmptyDescription className="max-w-xs text-pretty">
        You&apos;re all caught up. New notifications will appear here.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline">
        <Icon name="refresh-ccw" data-icon="inline-start" />
        Refresh
      </Button>
    </EmptyContent>
  </Empty>
);
