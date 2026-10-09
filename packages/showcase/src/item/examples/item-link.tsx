import { HugeiconsIcon } from "@hugeicons/react";
import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
import ExternalLinkIcon from "@hugeicons/core-free-icons/ExternalLinkIcon";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemLink() {
  return (
    <div className="flex w-full max-w-md flex-col gap-group">
      <Item
        render={
          <a href="#">
            <ItemContent>
              <ItemTitle>Visit our documentation</ItemTitle>
              <ItemDescription>Learn how to get started with our components.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon icon={ChevronRightIcon} className="size-4" />
            </ItemActions>
          </a>
        }
      />
      <Item
        variant="card"
        render={
          <a href="#" target="_blank" rel="noopener noreferrer">
            <ItemContent>
              <ItemTitle>External resource</ItemTitle>
              <ItemDescription>Opens in a new tab with security attributes.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon icon={ExternalLinkIcon} className="size-4" />
            </ItemActions>
          </a>
        }
      />
    </div>
  );
}
