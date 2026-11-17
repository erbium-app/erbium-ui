import { Icon } from "@erbium/ui/components/icon";
import {
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
  Item,
} from "@erbium/ui/components/item";

export const defaultProps = {
  asLink: false,
  className: "",
  mediaVariant: "icon",
  size: "default",
  variant: "default",
} satisfies {
  variant: "default" | "card";
  size: "default" | "sm" | "xs";
  mediaVariant: "default" | "icon" | "image";
  asLink: boolean;
  className: string;
};

export default function ItemPlaygroundExample(
  args: {
    variant: "default" | "card";
    size: "default" | "sm" | "xs";
    mediaVariant: "default" | "icon" | "image";
    asLink: boolean;
    className: string;
  } = defaultProps,
) {
  return (
    <Item
      aria-label="Choose option"
      variant={args.variant}
      size={args.size}
      render={args.asLink ? <a aria-label="View details" href="#overview" /> : undefined}
      className={`w-80 ${args.className}`}
    >
      <ItemMedia variant={args.mediaVariant}>
        <Icon name="star" aria-hidden="true" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Item title</ItemTitle>
        <ItemDescription>Item description</ItemDescription>
      </ItemContent>
    </Item>
  );
}
