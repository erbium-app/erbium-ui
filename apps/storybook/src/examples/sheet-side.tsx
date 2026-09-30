import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import { Label } from "@erbium/ui/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetTitle,
  SheetTrigger,
} from "@erbium/ui/components/sheet";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

export default function SheetSide() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline">{side}</Button>} />
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <SheetPanel className="grid content-start gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`name-${side}`} className="text-end">
                  Name
                </Label>
                <Input id={`name-${side}`} defaultValue="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`username-${side}`} className="text-end">
                  Username
                </Label>
                <Input id={`username-${side}`} defaultValue="@peduarte" className="col-span-3" />
              </div>
            </SheetPanel>
            <SheetFooter>
              <SheetClose render={<Button>Save changes</Button>} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
