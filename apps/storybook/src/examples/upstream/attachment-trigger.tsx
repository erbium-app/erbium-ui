import { HugeiconsIcon } from "@hugeicons/react";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import FileSearchIcon from "@hugeicons/core-free-icons/FileSearchIcon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@erbium/ui/components/attachment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

export function AttachmentTriggerDemo() {
  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <Dialog>
        <Attachment className="w-full">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileSearchIcon} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>research-summary.pdf</AttachmentTitle>
            <AttachmentDescription>Open preview dialog</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Copy link">
              <HugeiconsIcon icon={CopyIcon} />
            </AttachmentAction>
            <AttachmentAction aria-label="Remove research-summary.pdf">
              <HugeiconsIcon icon={XIcon} />
            </AttachmentAction>
          </AttachmentActions>
          <DialogTrigger render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />} />
        </Attachment>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>research-summary.pdf</DialogTitle>
            <DialogDescription>
              The attachment trigger fills the card and opens the dialog, while the actions stay
              independently clickable above it.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
