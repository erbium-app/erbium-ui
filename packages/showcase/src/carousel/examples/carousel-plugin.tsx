import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@erbium/ui/components/carousel";

export default function CarouselPlugin() {
  const [plugin] = React.useState(() => Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin]}
      className="w-full max-w-[10rem] sm:max-w-xs"
      onMouseEnter={plugin.stop}
      onMouseLeave={plugin.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="aspect-square">
                <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                  <span className="text-display font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
