import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

export default function CarouselSpacingExample() {
  return (
    <Carousel aria-label="Numbers" className="w-full max-w-sm [--carousel-gap:--spacing(1)]">
      <CarouselSlides>
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselSlide key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="aspect-square">
              <CardContent className="flex min-h-0 flex-1 items-center justify-center">
                <span className="text-title font-semibold">{index + 1}</span>
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
