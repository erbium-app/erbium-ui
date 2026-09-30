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

export default function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Share</Button>} />
      <DialogPanel className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <DialogContent className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
          </div>
        </DialogContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose
            render={
              <Button type="button" variant="secondary">
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
}
