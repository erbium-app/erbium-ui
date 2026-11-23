import { Icon } from "@erbium/ui/components/icon";
import type * as React from "react";
import {
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentRemove,
  AttachmentTrigger,
  Attachment,
} from "@erbium/ui/components/attachment";

type AttachmentProps = React.ComponentProps<typeof Attachment>;

// Control values come from the components' own props, so the controls track their variants.
export interface PlaygroundArgs {
  state: NonNullable<AttachmentProps["state"]>;
  size: NonNullable<AttachmentProps["size"]>;
  orientation: NonNullable<AttachmentProps["orientation"]>;
  mediaVariant: NonNullable<React.ComponentProps<typeof AttachmentMedia>["variant"]>;
  className: string;
  title: string;
  triggerAsLink: boolean;
}

export const defaultProps = {
  className: "",
  mediaVariant: "icon",
  orientation: "horizontal",
  size: "default",
  state: "done",
  title: "document.pdf",
  triggerAsLink: false,
} satisfies PlaygroundArgs;

export default function AttachmentPlaygroundExample(args: PlaygroundArgs = defaultProps) {
  return (
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
      <AttachmentTrigger
        aria-label={`Open ${args.title}`}
        render={args.triggerAsLink ? <a aria-label="View details" href="#overview" /> : undefined}
      />
      <AttachmentRemove aria-label="Remove attachment" />
    </Attachment>
  );
}
