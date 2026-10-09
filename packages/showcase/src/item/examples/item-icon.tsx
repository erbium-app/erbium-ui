import { HugeiconsIcon } from "@hugeicons/react";
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon";

import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemIcon() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-section">
      <Item variant="card">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={ShieldAlertIcon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Security Alert</ItemTitle>
          <ItemDescription>New login detected from unknown device.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Review
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
