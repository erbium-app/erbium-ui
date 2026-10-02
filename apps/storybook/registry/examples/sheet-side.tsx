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

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

export default function SheetSide() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline">{side}</Button>} />
          <SheetPanel side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <SheetContent className="grid content-start gap-4">
              <Field className="grid grid-cols-4 items-center gap-4">
                <FieldLabel htmlFor={`name-${side}`} className="text-end">
                  Name
                </FieldLabel>
                <Input id={`name-${side}`} defaultValue="Pedro Duarte" className="col-span-3" />
              </Field>
              <Field className="grid grid-cols-4 items-center gap-4">
                <FieldLabel htmlFor={`username-${side}`} className="text-end">
                  Username
                </FieldLabel>
                <Input id={`username-${side}`} defaultValue="@peduarte" className="col-span-3" />
              </Field>
            </SheetContent>
            <SheetFooter>
              <SheetClose render={<Button>Save changes</Button>} />
            </SheetFooter>
          </SheetPanel>
        </Sheet>
      ))}
    </div>
  );
}
