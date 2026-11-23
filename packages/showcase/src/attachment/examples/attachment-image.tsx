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
  LightboxZoomIn,
  LightboxZoomOut,
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

const images = [
  {
    alt: "A workspace with long desks and hanging lights",
    meta: "PNG · 820 KB",
    name: "workspace.png",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  {
    alt: "A plant-filled desk by large windows",
    meta: "JPG · 1.1 MB",
    name: "desk-reference.jpg",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
  },
  {
    alt: "An office with a central table and chairs",
    meta: "JPG · 940 KB",
    name: "office-reference.jpg",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  },
];

export default function AttachmentImageExample() {
  return (
    <Lightbox>
      <div className="mx-auto w-full max-w-sm py-12">
        <AttachmentGroup className="w-full">
          {images.map((image, index) => (
            <Attachment key={image.name} orientation="vertical">
              <LightboxTrigger
                aria-label={`Open ${image.name}`}
                className="cursor-zoom-in"
                index={index}
                render={<AttachmentTrigger />}
              >
                {({ imageRef }) => (
                  <AttachmentMedia variant="image">
                    <img
                      alt={image.alt}
                      height={360}
                      ref={imageRef}
                      src={`${image.src}?auto=format&fit=crop&w=480&h=360&q=80`}
                      width={480}
                    />
                  </AttachmentMedia>
                )}
              </LightboxTrigger>
              <AttachmentContent>
                <AttachmentTitle>{image.name}</AttachmentTitle>
                <AttachmentDescription>{image.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentRemove aria-label={`Remove ${image.name}`} />
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
          <div className="flex items-center gap-2 justify-self-end">
            <LightboxZoomOut />
            <LightboxZoomIn />
            <LightboxClose />
          </div>
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
