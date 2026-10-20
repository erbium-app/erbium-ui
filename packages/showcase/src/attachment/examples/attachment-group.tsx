import { Icon } from "@erbium/ui/components/icon";
import type { IconProps } from "@erbium/ui/components/icon";
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

interface Item {
  name: string;
  meta: string;
  icon?: IconProps["name"];
  src?: string;
}

const items: Item[] = [
  { icon: "file-text", meta: "PDF · 1.4 MB", name: "briefing-notes.pdf" },
  {
    meta: "PNG · 820 KB",
    name: "workspace.png",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
  },
  { icon: "table", meta: "CSV · 18 KB", name: "customers.csv" },
  { icon: "file-code", meta: "TSX · 12 KB", name: "renderer.tsx" },
];

export const AttachmentGroupDemo = () => (
  <div className="mx-auto w-full max-w-sm py-12">
    <AttachmentGroup className="w-full">
      {items.map((item) => {
        const { icon } = item;

        return (
          <Attachment key={item.name} className="w-64">
            {item.src ? (
              <AttachmentMedia variant="image">
                <img src={item.src} alt={item.name} />
              </AttachmentMedia>
            ) : icon ? (
              <AttachmentMedia>
                <Icon name={icon} />
              </AttachmentMedia>
            ) : null}
            <AttachmentContent>
              <AttachmentTitle>{item.name}</AttachmentTitle>
              <AttachmentDescription>{item.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${item.name}`}>
                <Icon name="x" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        );
      })}
    </AttachmentGroup>
  </div>
);
