import * as React from "react";

import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";
import type { CarouselNavigationSource } from "@erbium/ui/components/carousel";

interface CarouselEvent {
  value: number;
  source: CarouselNavigationSource;
}

export default function CarouselEventsExample() {
  const [event, setEvent] = React.useState<CarouselEvent | null>(null);

  return (
    <div className="mx-auto flex max-w-[10rem] flex-col items-center gap-4 sm:max-w-xs">
      <Carousel
        aria-label="Numbers"
        className="w-full"
        onValueChange={(value, { source }) => {
          setEvent({ source, value });
        }}
      >
        <CarouselSlides>
          {Array.from({ length: 5 }, (_, index) => (
            <CarouselSlide key={index}>
              <Card className="aspect-square">
                <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                  <span className="text-display font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselSlide>
          ))}
        </CarouselSlides>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicator />
      </Carousel>
      <p className="text-control-sm text-muted-foreground" aria-live="polite">
        {event ? `Slide ${event.value + 1} via ${event.source}` : "Move the carousel"}
      </p>
    </div>
  );
}
