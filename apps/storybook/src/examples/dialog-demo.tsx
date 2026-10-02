import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { StatefulButton } from "@erbium/ui/components/stateful-button";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogPanel
        className="sm:max-w-[425px]"
        render={<form onSubmit={(event) => event.preventDefault()} />}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="grid content-start gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" defaultValue="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input name="username" defaultValue="@peduarte" />
          </Field>
        </DialogContent>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <StatefulButton type="submit">Save changes</StatefulButton>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
}
