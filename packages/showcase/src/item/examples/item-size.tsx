import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";

const ItemSizeDemo = () => (
  <div className="flex w-full max-w-md flex-col gap-section">
    <Item variant="card">
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
      variant="card"
      size="sm"
      render={
        <a href="#">
          <ItemMedia>
            <Icon name="badge-check" className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Icon name="chevron-right" className="size-4" />
          </ItemActions>
        </a>
      }
    />
  </div>
);

export default ItemSizeDemo;
