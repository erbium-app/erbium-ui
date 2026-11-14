import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Carousel>) => (
  <Carousel aria-label="Slides" {...args} className="w-72">
    <CarouselSlides className={args.orientation === "vertical" ? "h-40" : undefined}>
      {[1, 2, 3].map((item) => (
        <CarouselSlide key={item}>
          <Card className="h-32">
            <CardContent className="flex min-h-0 flex-1 items-center justify-center">
              Slide {item}
            </CardContent>
          </Card>
        </CarouselSlide>
      ))}
    </CarouselSlides>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

export default Example;
