import { Card, CardContent } from "@erbium/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@erbium/ui/components/carousel";

const CarouselOrientation = () => (
  <Carousel
    opts={{
      align: "start",
    }}
    orientation="vertical"
    className="w-full max-w-xs"
  >
    <CarouselContent className="-mt-1 h-[200px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <CarouselItem key={index} className="pt-1 md:basis-1/2">
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

export default CarouselOrientation;
