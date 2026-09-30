import { HugeiconsIcon } from "@hugeicons/react";
import AlertSquareIcon from "@hugeicons/core-free-icons/AlertSquareIcon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";
import { Spinner } from "@erbium/ui/components/spinner";

export function AttachmentStates() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2 py-12">
      <Attachment state="idle" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={Clock01Icon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>selected-file.pdf</AttachmentTitle>
          <AttachmentDescription>Ready to upload</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove selected-file.pdf">
            <HugeiconsIcon icon={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-system.zip</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <HugeiconsIcon icon={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="processing" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={FileTextIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>market-research.pdf</AttachmentTitle>
          <AttachmentDescription>Processing document</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove market-research.pdf">
            <HugeiconsIcon icon={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="error" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={AlertSquareIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
          <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry upload">
            <HugeiconsIcon icon={RefreshCwIcon} />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove financial-model.xlsx">
            <HugeiconsIcon icon={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="done" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={CheckIcon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove uploaded-report.pdf">
            <HugeiconsIcon icon={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}
