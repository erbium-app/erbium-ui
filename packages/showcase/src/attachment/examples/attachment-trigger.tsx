import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";

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
  DialogPanel,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

export default function AttachmentTriggerExample() {
  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <Dialog>
        <Attachment className="w-full">
          <AttachmentMedia>
            <Icon name="file-search" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>research-summary.pdf</AttachmentTitle>
            <AttachmentDescription>Open preview dialog</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <CopyButton
              value="https://example.com/research-summary.pdf"
              aria-label="Copy attachment link"
              render={<AttachmentAction />}
            />
            <AttachmentAction aria-label="Remove research-summary.pdf">
              <Icon name="x" />
            </AttachmentAction>
          </AttachmentActions>
          <DialogTrigger render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />} />
        </Attachment>
        <DialogPanel className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>research-summary.pdf</DialogTitle>
            <DialogDescription>
              The attachment trigger fills the card and opens the dialog, while the actions stay
              independently clickable above it.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>Preview the attachment before opening it.</DialogContent>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
