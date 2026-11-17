import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemVariantExample() {
  return (
    <div className="flex flex-col gap-section">
      <Item>
        <ItemContent>
          <ItemTitle>Default Variant</ItemTitle>
          <ItemDescription>Flat styling that inherits its surrounding surface.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="card">
        <ItemContent>
          <ItemTitle>Card Variant</ItemTitle>
          <ItemDescription>Raised panel styling with a subtle edge and shadow.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
