import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Carousel,
} from "@erbium/ui/components/carousel";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Carousel>) => (
  <Carousel {...args} className={args.orientation === "vertical" ? "h-64 w-72" : "w-72"}>
    <CarouselContent>
      {[1, 2, 3].map((item) => (
        <CarouselItem key={item}>
          <div className="flex h-32 items-center justify-center rounded border">Slide {item}</div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

export default Example;
