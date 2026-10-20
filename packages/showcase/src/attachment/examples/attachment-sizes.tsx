import { Icon } from "@erbium/ui/components/icon";

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";

export const AttachmentSizes = () => (
  <div className="mx-auto flex w-full max-w-sm flex-col gap-3 py-12">
    <Attachment size="default" className="w-full">
      <AttachmentMedia>
        <Icon name="file-text" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Default attachment</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
    <Attachment size="sm" className="w-full">
      <AttachmentMedia>
        <Icon name="file-text" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Small attachment</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
    <Attachment size="xs" className="w-full">
      <AttachmentMedia>
        <Icon name="file-text" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Extra small attachment</AttachmentTitle>
      </AttachmentContent>
    </Attachment>
  </div>
);
