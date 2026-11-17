import {
  Sheet,
  SheetTrigger,
  SheetPanel,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@erbium/ui/components/sheet";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = { defaultOpen: false, showCloseButton: true, side: "right" } satisfies {
  side: "top" | "right" | "bottom" | "left";
  showCloseButton: boolean;
  defaultOpen: boolean;
};

export default function SheetPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    showCloseButton: boolean;
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <Sheet key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
      <SheetPanel side={args.side} showCloseButton={args.showCloseButton}>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description.</SheetDescription>
        </SheetHeader>
        <SheetContent>Sheet content.</SheetContent>
      </SheetPanel>
    </Sheet>
  );
}
