// @ts-nocheck
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Field, FieldLabel } from "../components/field";
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
} from "../components/sheet";

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
            <FieldLabel>Name</FieldLabel>
            <Input defaultValue="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input defaultValue="@peduarte" />
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
