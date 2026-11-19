import * as React from "react";

import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxStepIndicator,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
  LightboxZoom,
} from "@erbium/ui/blocks/lightbox";
import {
  Carousel,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

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

/** Carousel and lightbox share one index, so closing the viewer lands on the photo last shown. */
export default function CarouselLightboxExample() {
  const [value, setValue] = React.useState(0);

  return (
    <Lightbox value={value} onValueChange={setValue}>
      <Carousel
        aria-label="Workspace photos"
        className="w-full max-w-xs"
        value={value}
        onValueChange={setValue}
      >
        <CarouselSlides>
          {photos.map((photo, index) => (
            <CarouselSlide key={photo.src}>
              <LightboxTrigger
                aria-label={`Open ${photo.caption}`}
                className="block overflow-hidden rounded-lg"
                index={index}
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
            </CarouselSlide>
          ))}
        </CarouselSlides>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicator />
      </Carousel>

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

        <LightboxHeader className="grid grid-cols-[1fr_auto_1fr]">
          <div />
          <LightboxStepIndicator labels={photos.map((photo) => photo.caption)} />
          <div className="flex items-center gap-2 justify-self-end">
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
