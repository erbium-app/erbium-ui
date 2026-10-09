import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@erbium/ui/components/dialog";

export default function ProgrammaticExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-related">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open from application state
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>
          Open from dialog trigger
        </DialogTrigger>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>Project details</DialogTitle>
            <DialogDescription>
              The same dialog can open from its trigger or application state.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <p className="text-body">
              Close this dialog and check that focus returns to the control that opened it.
            </p>
          </DialogContent>
          <DialogFooter>
            <DialogClose render={<Button />}>Done</DialogClose>
          </DialogFooter>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
