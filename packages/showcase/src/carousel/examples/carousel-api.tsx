import * as React from "react";

import { Button } from "@erbium/ui/components/button";
import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselCounter,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

const slides = ["Plan", "Build", "Review", "Ship", "Measure"];

export default function CarouselApiExample() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
      <Carousel aria-label="Workflow" value={value} onValueChange={setValue} className="w-full">
        <CarouselSlides>
          {slides.map((slide) => (
            <CarouselSlide key={slide}>
              <Card className="aspect-square">
                <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                  <span className="text-title font-semibold">{slide}</span>
                </CardContent>
              </Card>
            </CarouselSlide>
          ))}
        </CarouselSlides>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicator />
        <CarouselCounter className="mt-2 block text-center" />
      </Carousel>
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((slide, index) => (
          <Button
            key={slide}
            size="sm"
            variant={index === value ? "secondary" : "ghost"}
            aria-pressed={index === value}
            onClick={() => {
              setValue(index);
            }}
          >
            {slide}
          </Button>
        ))}
      </div>
    </div>
  );
}
