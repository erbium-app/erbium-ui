import { Icon } from "@erbium/ui/components/icon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@erbium/ui/components/attachment";

const images = [
  {
    alt: "Workspace",
    meta: "PNG · 820 KB",
    name: "workspace.png",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
  },
  {
    alt: "Desk",
    meta: "JPG · 1.1 MB",
    name: "desk-reference.jpg",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80",
  },
  {
    alt: "Office",
    meta: "JPG · 940 KB",
    name: "office-reference.jpg",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",
  },
];

export const AttachmentImage = () => (
  <div className="mx-auto w-full max-w-sm py-12">
    <AttachmentGroup className="w-full">
      {images.map((image) => (
        <Attachment key={image.name} orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={image.src} alt={image.alt} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{image.name}</AttachmentTitle>
            <AttachmentDescription>{image.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${image.name}`}>
              <Icon name="x" />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${image.name}`}
              />
            }
          />
        </Attachment>
      ))}
    </AttachmentGroup>
  </div>
);
