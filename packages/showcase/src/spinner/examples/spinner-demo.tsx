import { Item, ItemContent, ItemMedia, ItemTitle } from "@erbium/ui/components/item";
import { Spinner } from "@erbium/ui/components/spinner";

export default function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-group [--radius:1rem]">
      <Item variant="card">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-caption tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
    </div>
  );
}
