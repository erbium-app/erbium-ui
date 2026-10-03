import {
  Dialog,
  DialogTrigger,
  DialogPanel,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@erbium/ui/components/dialog";
import { Button } from "@erbium/ui/components/button";

const Example = (args: { defaultOpen: boolean; showCloseButton: boolean }) => (
  <Dialog key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
    <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
    <DialogPanel showCloseButton={args.showCloseButton}>
      <DialogHeader>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogDescription>Dialog description.</DialogDescription>
      </DialogHeader>
      <DialogContent>Dialog content.</DialogContent>
    </DialogPanel>
  </Dialog>
);

export default Example;
