import { Button } from "@erbium/ui/components/button";
import {
  Sheet,
  SheetPanel,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@erbium/ui/components/sheet";

export default function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open Sheet</SheetTrigger>
      <SheetPanel showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>
            This sheet doesn&apos;t have a close button in the top-right corner. Click outside to
            close.
          </SheetDescription>
        </SheetHeader>
        <SheetContent>Review your changes here.</SheetContent>
      </SheetPanel>
    </Sheet>
  );
}
