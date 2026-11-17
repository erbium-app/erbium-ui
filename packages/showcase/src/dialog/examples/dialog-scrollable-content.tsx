import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogPanel,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

export default function DialogScrollableContentExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Scrollable Content</DialogTrigger>
      <DialogPanel>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
        </DialogHeader>
        <DialogContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <p key={index} className="mb-4 ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          ))}
        </DialogContent>
      </DialogPanel>
    </Dialog>
  );
}
