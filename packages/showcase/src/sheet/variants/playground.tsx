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

const Example = (args: {
  side: "top" | "right" | "bottom" | "left";
  showCloseButton: boolean;
  defaultOpen: boolean;
}) => (
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

export default Example;
