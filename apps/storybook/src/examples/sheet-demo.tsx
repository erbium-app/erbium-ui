import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";
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
          <Field>
            <FieldLabel htmlFor="sheet-demo-name">Name</FieldLabel>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-demo-username">Username</FieldLabel>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </Field>
        </SheetContent>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Close</Button>} />
          <SheetClose render={<Button>Save changes</Button>} />
        </SheetFooter>
      </SheetPanel>
    </Sheet>
  );
}
