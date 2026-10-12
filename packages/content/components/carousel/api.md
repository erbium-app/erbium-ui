---
title: "Api"
story: Api
---

Add `CarouselIndicator` for dots that follow the carousel and scroll to a slide when clicked. For anything custom, use a state and the `setApi` prop to get an instance of the carousel API.

```tsx
<Carousel>
  <CarouselContent>...</CarouselContent>
  <CarouselIndicator />
</Carousel>
```

```tsx
import { type CarouselApi } from "@erbium/ui/components/carousel";

export function Example() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(2);
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
