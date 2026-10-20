import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogPanel,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

export const DialogNoCloseButton = () => (
  <Dialog>
    <DialogTrigger render={<Button variant="outline" />}>No Close Button</DialogTrigger>
    <DialogPanel showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>No Close Button</DialogTitle>
        <DialogDescription>
          This dialog doesn&apos;t have a close button in the top-right corner.
        </DialogDescription>
      </DialogHeader>
      <DialogContent>Use the escape key or click outside to close.</DialogContent>
    </DialogPanel>
  </Dialog>
);
