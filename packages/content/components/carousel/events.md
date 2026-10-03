---
title: "Events"
story: Events
---

You can listen to events using the api instance from `setApi`.

See the [Embla Carousel docs](https://www.embla-carousel.com/api/events/) for more information on using events.

```tsx
import { type CarouselApi } from "@erbium/ui/components/carousel";

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      // Do something on select.
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
```
