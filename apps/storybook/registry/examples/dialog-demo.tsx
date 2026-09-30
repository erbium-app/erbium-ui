// @ts-nocheck
import { Button } from "../components/button";
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
} from "../components/dialog";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { StatefulButton } from "../components/stateful-button";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogPanel
        className="sm:max-w-106"
        render={<form onSubmit={(event) => event.preventDefault()} />}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="grid content-start gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">Username</Label>
            <Input id="username-1" name="username" defaultValue="@peduarte" />
          </div>
        </DialogContent>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <StatefulButton type="submit">Save changes</StatefulButton>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
}
