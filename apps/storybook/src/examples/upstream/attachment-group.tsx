import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import TableIcon from "@hugeicons/core-free-icons/TableIcon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";

type Item = {
  name: string;
  meta: string;
  icon?: IconSvgElement;
  src?: string;
};

const items: Item[] = [
  { name: "briefing-notes.pdf", meta: "PDF · 1.4 MB", icon: FileTextIcon },
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
  },
  { name: "customers.csv", meta: "CSV · 18 KB", icon: TableIcon },
  { name: "renderer.tsx", meta: "TSX · 12 KB", icon: FileCodeIcon },
];

export function AttachmentGroupDemo() {
  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <AttachmentGroup className="w-full">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Attachment key={item.name} className="w-64">
              {item.src ? (
                <AttachmentMedia variant="image">
                  <img src={item.src} alt={item.name} />
                </AttachmentMedia>
              ) : Icon ? (
                <AttachmentMedia>
                  <HugeiconsIcon icon={Icon} />
                </AttachmentMedia>
              ) : null}
              <AttachmentContent>
                <AttachmentTitle>{item.name}</AttachmentTitle>
                <AttachmentDescription>{item.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${item.name}`}>
                  <HugeiconsIcon icon={XIcon} />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          );
        })}
      </AttachmentGroup>
    </div>
  );
}
