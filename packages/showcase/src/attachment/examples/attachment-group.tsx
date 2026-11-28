import { Icon } from "@erbium/ui/components/icon";
import type { IconProps } from "@erbium/ui/components/icon";
import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxStepIndicator,
  LightboxTrigger,
  LightboxZoom,
} from "@erbium/ui/blocks/lightbox";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentRemove,
  AttachmentTitle,
  AttachmentTrigger,
} from "@erbium/ui/components/attachment";

interface FileItem {
  kind: "file";
  name: string;
  meta: string;
  icon: IconProps["name"];
}

interface ImageItem {
  kind: "image";
  name: string;
  meta: string;
  alt: string;
  src: string;
}

const items: (FileItem | ImageItem)[] = [
  { icon: "file-text", kind: "file", meta: "PDF · 1.4 MB", name: "briefing-notes.pdf" },
  {
    alt: "A workspace with long desks and hanging lights",
    kind: "image",
    meta: "PNG · 820 KB",
    name: "workspace.png",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  { icon: "table", kind: "file", meta: "CSV · 18 KB", name: "customers.csv" },
  {
    alt: "A plant-filled desk by large windows",
    kind: "image",
    meta: "JPG · 1.1 MB",
    name: "desk-reference.jpg",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
  },
  { icon: "file-code", kind: "file", meta: "TSX · 12 KB", name: "renderer.tsx" },
];

// The lightbox holds only the images.
const images = items.filter((item): item is ImageItem => item.kind === "image");

export default function AttachmentGroupExample() {
  return (
    <Lightbox>
      <div className="mx-auto w-full max-w-sm py-12">
        <AttachmentGroup className="w-full">
          {items.map((item) => (
            <Attachment key={item.name} className="w-64">
              {item.kind === "file" ? (
                <AttachmentMedia>
                  <Icon name={item.icon} />
                </AttachmentMedia>
              ) : (
                <LightboxTrigger
                  aria-label={`Open ${item.name}`}
                  className="cursor-zoom-in"
                  itemId={item.src}
                  render={<AttachmentTrigger />}
                >
                  {({ imageRef }) => (
                    <AttachmentMedia variant="image">
                      <img
                        alt={item.alt}
                        height={80}
                        ref={imageRef}
                        src={`${item.src}?auto=format&fit=crop&w=80&h=80&q=80`}
                        width={80}
                      />
                    </AttachmentMedia>
                  )}
                </LightboxTrigger>
              )}
              <AttachmentContent>
                <AttachmentTitle>{item.name}</AttachmentTitle>
                <AttachmentDescription>{item.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentRemove aria-label={`Remove ${item.name}`} />
            </Attachment>
          ))}
        </AttachmentGroup>
      </div>

      <LightboxContent aria-label="Attached images">
        <LightboxSlides aria-label="Attached images" aria-roledescription="carousel">
          {images.map((image, index) => (
            <LightboxSlide key={image.name}>
              <LightboxItem
                aria-label={`${index + 1} of ${images.length}`}
                aria-roledescription="slide"
                caption={image.name}
                index={index}
                itemId={image.src}
              >
                <LightboxZoom>
                  <LightboxMedia height={1350} width={1800}>
                    <img
                      alt={image.alt}
                      height={1350}
                      src={`${image.src}?auto=format&fit=crop&w=1800&h=1350&q=85`}
                      width={1800}
                    />
                  </LightboxMedia>
                </LightboxZoom>
              </LightboxItem>
            </LightboxSlide>
          ))}
        </LightboxSlides>

        <LightboxHeader className="grid grid-cols-[1fr_auto_1fr]">
          <div />
          <LightboxStepIndicator labels={images.map((image) => image.name)} />
          <LightboxClose className="justify-self-end" />
        </LightboxHeader>

        <LightboxPrevious />
        <LightboxNext />

        <LightboxFooter>
          <LightboxCaption />
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  );
}
