import { HugeiconsIcon } from "@hugeicons/react";
import BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";
import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";

import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>A simple item with title and description.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item
        variant="outline"
        size="sm"
        render={
          <a href="#">
            <ItemMedia>
              <HugeiconsIcon icon={BadgeCheckIcon} className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Your profile has been verified.</ItemTitle>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon icon={ChevronRightIcon} className="size-4" />
            </ItemActions>
          </a>
        }
      />
    </div>
  );
}
