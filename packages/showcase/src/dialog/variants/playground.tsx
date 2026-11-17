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

export const defaultProps = {
  defaultOpen: false,
  showCloseButton: true,
} satisfies { defaultOpen: boolean; showCloseButton: boolean };

export default function DialogPlaygroundExample(
  args: { defaultOpen: boolean; showCloseButton: boolean } = defaultProps,
) {
  return (
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
}
