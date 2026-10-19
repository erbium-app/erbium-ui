import { Icon } from "@erbium/ui/components/icon";
import {
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  Attachment,
} from "@erbium/ui/components/attachment";

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
      <Icon name={args.mediaVariant === "icon" ? "file-text" : "image-01"} aria-hidden="true" />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>{args.title}</AttachmentTitle>
      <AttachmentDescription>2.4 MB</AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction size={args.actionSize} aria-label="Remove attachment">
        <Icon name="cancel-01" aria-hidden="true" />
      </AttachmentAction>
    </AttachmentActions>
    <AttachmentTrigger
      aria-label={`Open ${args.title}`}
      render={args.triggerAsLink ? <a href="#" /> : undefined}
    />
  </Attachment>
);

export default Example;
