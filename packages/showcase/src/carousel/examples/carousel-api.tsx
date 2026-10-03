import * as React from "react";

import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@erbium/ui/components/carousel";

export default function CarouselDApiDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!api) return () => {};
      api.on("select", notify);
      api.on("reInit", notify);
      return () => {
        api.off("select", notify);
        api.off("reInit", notify);
      };
    },
    [api],
  );
  const current = React.useSyncExternalStore(
    subscribe,
    () => (api ? api.selectedScrollSnap() + 1 : 0),
    () => 0,
  );
  const count = React.useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  );

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
