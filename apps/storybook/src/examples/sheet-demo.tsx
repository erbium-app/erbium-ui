import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import { Label } from "@erbium/ui/components/label";
import {
  Sheet,
  SheetClose,
  SheetPanel,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@erbium/ui/components/sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open</Button>} />
      <SheetPanel>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <SheetContent className="grid content-start gap-6">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </SheetContent>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Close</Button>} />
          <SheetClose render={<Button>Save changes</Button>} />
        </SheetFooter>
      </SheetPanel>
    </Sheet>
  );
}
