import { ItemContent, ItemTitle, ItemDescription, ItemMedia } from "@erbium/ui/components/item";
import { Item } from "@erbium/ui/components/item";

const Example = (args: {
  variant: "default" | "outline" | "muted";
  size: "default" | "sm" | "xs";
  mediaVariant: "default" | "icon" | "image";
  asLink: boolean;
  className: string;
}) => (
  <Item
    variant={args.variant}
    size={args.size}
    render={args.asLink ? <a href="#" /> : undefined}
    className={`w-80 ${args.className}`}
  >
    <ItemMedia variant={args.mediaVariant}>☆</ItemMedia>
    <ItemContent>
      <ItemTitle>Item title</ItemTitle>
      <ItemDescription>Item description</ItemDescription>
    </ItemContent>
  </Item>
);

export default Example;
