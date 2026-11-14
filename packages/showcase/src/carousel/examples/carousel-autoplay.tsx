import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselAutoplay,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

const CarouselAutoplayDemo = () => (
  <Carousel aria-label="Numbers" loop className="w-full max-w-[10rem] sm:max-w-xs">
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
    <div className="mt-4 flex items-center justify-center gap-3">
      <CarouselAutoplay delay={2000} />
      <CarouselIndicator className="mx-0 mt-0" />
    </div>
  </Carousel>
);

export default CarouselAutoplayDemo;
