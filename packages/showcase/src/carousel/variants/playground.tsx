import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";
import type * as React from "react";

export const defaultProps = {
  align: "start",
  dragFree: false,
  loop: false,
  orientation: "horizontal",
} satisfies React.ComponentProps<typeof Carousel>;

export default function CarouselPlaygroundExample(
  args: React.ComponentProps<typeof Carousel> = defaultProps,
) {
  return (
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
}
