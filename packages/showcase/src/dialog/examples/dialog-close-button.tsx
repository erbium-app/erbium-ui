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

export default function DialogCloseButtonExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Share</Button>} />
      <DialogPanel className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <DialogContent className="flex items-center gap-related">
          <Field className="flex-1">
            <FieldLabel className="sr-only">Link</FieldLabel>
            <Input defaultValue="https://ui.erbium.app/docs/installation" readOnly />
          </Field>
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
