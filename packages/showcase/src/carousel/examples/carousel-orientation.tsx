import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

export default function CarouselOrientationExample() {
  return (
    <Carousel
      aria-label="Numbers"
      align="start"
      orientation="vertical"
      className="w-full max-w-xs [--carousel-gap:--spacing(2)]"
    >
      <CarouselSlides className="h-72">
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselSlide key={index} className="md:basis-1/2">
            <Card className="h-full">
              <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                <span className="text-display font-semibold">{index + 1}</span>
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
