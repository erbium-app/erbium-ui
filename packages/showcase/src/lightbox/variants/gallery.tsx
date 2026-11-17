import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxThumbnail,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
} from "@erbium/ui/blocks/lightbox";

const photos = [
  {
    alt: "A workspace with long desks and hanging lights",
    caption: "Studio",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  {
    alt: "A plant-filled office with large windows",
    caption: "Office",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  },
  {
    alt: "A workspace with a central table and chairs",
    caption: "Meeting room",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
  },
];

export default function GalleryExample() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-md grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <LightboxTrigger
            aria-label={`Open ${photo.caption}`}
            className="overflow-hidden rounded-lg"
            index={index}
            key={photo.src}
          >
            {({ imageRef }) => (
              <img
                alt={photo.alt}
                className="aspect-[3/2] w-full object-cover"
                height={240}
                ref={imageRef}
                src={`${photo.src}?auto=format&fit=crop&w=360&h=240&q=80`}
                width={360}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>

      <LightboxContent aria-label="Workspace photos">
        <LightboxSlides aria-label="Workspace photos" aria-roledescription="carousel">
          {photos.map((photo, index) => (
            <LightboxSlide key={photo.src}>
              <LightboxItem
                aria-label={`${index + 1} of ${photos.length}`}
                aria-roledescription="slide"
                caption={photo.caption}
                index={index}
              >
                <LightboxZoom>
                  <LightboxMedia height={1200} width={1800}>
                    <img
                      alt={photo.alt}
                      height={1200}
                      src={`${photo.src}?auto=format&fit=crop&w=1800&h=1200&q=85`}
                      width={1800}
                    />
                  </LightboxMedia>
                </LightboxZoom>
              </LightboxItem>
            </LightboxSlide>
          ))}
        </LightboxSlides>

        <LightboxHeader>
          <LightboxZoomOut />
          <LightboxZoomIn />
          <LightboxClose />
        </LightboxHeader>

        <LightboxPrevious />
        <LightboxNext />

        <LightboxFooter>
          <LightboxCaption />
          <LightboxCounter />
          <LightboxThumbnailStrip>
            <LightboxThumbnailStripTrack aria-label="Workspace photo thumbnails">
              {photos.map((photo, index) => (
                <LightboxThumbnail aria-label={photo.caption} index={index} key={photo.src}>
                  <img
                    alt=""
                    height={112}
                    src={`${photo.src}?auto=format&fit=crop&w=112&h=112&q=75`}
                    width={112}
                  />
                </LightboxThumbnail>
              ))}
            </LightboxThumbnailStripTrack>
          </LightboxThumbnailStrip>
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  );
}
