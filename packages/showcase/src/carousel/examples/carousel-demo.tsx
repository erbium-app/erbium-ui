import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";

const CarouselDemo = () => (
  <Carousel aria-label="Numbers" className="w-full max-w-xs">
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
  </Carousel>
);

export default CarouselDemo;
