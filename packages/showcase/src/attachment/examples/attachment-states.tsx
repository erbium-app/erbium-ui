import { Icon } from "@erbium/ui/components/icon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentRemove,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";
import { Spinner } from "@erbium/ui/components/spinner";

export default function AttachmentStatesExample() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-related py-12">
      <Attachment state="idle" className="w-full">
        <AttachmentMedia>
          <Icon name="clock-01" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>selected-file.pdf</AttachmentTitle>
          <AttachmentDescription>Ready to upload</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRemove aria-label="Remove selected-file.pdf" />
      </Attachment>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-system.zip</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRemove aria-label="Cancel upload" />
      </Attachment>
      <Attachment state="processing" className="w-full">
        <AttachmentMedia>
          <Icon name="file-text" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>market-research.pdf</AttachmentTitle>
          <AttachmentDescription>Processing document</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRemove aria-label="Remove market-research.pdf" />
      </Attachment>
      <Attachment state="error" className="w-full">
        <AttachmentMedia>
          <Icon name="alert-square" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
          <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry upload">
            <Icon name="refresh-cw" />
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentRemove aria-label="Remove financial-model.xlsx" />
      </Attachment>
      <Attachment state="done" className="w-full">
        <AttachmentMedia>
          <Icon name="check" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRemove aria-label="Remove uploaded-report.pdf" />
      </Attachment>
    </div>
  );
}
