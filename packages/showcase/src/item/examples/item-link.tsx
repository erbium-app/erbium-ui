import { Icon } from "@erbium/ui/components/icon";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemLinkExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-group">
      <Item
        render={
          <a href="#overview">
            <ItemContent>
              <ItemTitle>Visit our documentation</ItemTitle>
              <ItemDescription>Learn how to get started with our components.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="chevron-right" className="size-4" />
            </ItemActions>
          </a>
        }
      />
      <Item
        variant="card"
        render={
          <a href="#overview" target="_blank" rel="noopener noreferrer">
            <ItemContent>
              <ItemTitle>External resource</ItemTitle>
              <ItemDescription>Opens in a new tab with security attributes.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="external-link" className="size-4" />
            </ItemActions>
          </a>
        }
      />
    </div>
  );
}
