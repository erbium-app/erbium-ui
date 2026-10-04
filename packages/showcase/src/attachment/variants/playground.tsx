import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import Image01Icon from "@hugeicons/core-free-icons/Image01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
} from "@erbium/ui/components/attachment";
import { Attachment } from "@erbium/ui/components/attachment";

const Example = (args: {
  state: "idle" | "uploading" | "processing" | "error" | "done";
  size: "default" | "sm" | "xs";
  orientation: "horizontal" | "vertical";
  mediaVariant: "icon" | "image";
  className: string;
  title: string;
  actionSize: "icon-xs" | "icon-sm" | "icon";
  triggerAsLink: boolean;
}) => (
  <Attachment
    state={args.state}
    size={args.size}
    orientation={args.orientation}
    className={args.className}
  >
    <AttachmentMedia variant={args.mediaVariant}>
      <HugeiconsIcon
        icon={args.mediaVariant === "icon" ? FileTextIcon : Image01Icon}
        aria-hidden="true"
      />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>{args.title}</AttachmentTitle>
      <AttachmentDescription>2.4 MB</AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction size={args.actionSize} aria-label="Remove attachment">
        <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
      </AttachmentAction>
    </AttachmentActions>
    <AttachmentTrigger
      aria-label={`Open ${args.title}`}
      render={args.triggerAsLink ? <a href="#" /> : undefined}
    />
  </Attachment>
);

export default Example;
