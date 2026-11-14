---
title: "Spacing"
story: Spacing
---

Set the space between slides with the `--carousel-gap` custom property on `Carousel`. The default is `--spacing(4)`. Slide sizes set with `basis` stay exact at any gap.

```tsx
<Carousel aria-label="Products" className="[--carousel-gap:--spacing(1)]">
  <CarouselSlides>
    <CarouselSlide>...</CarouselSlide>
    <CarouselSlide>...</CarouselSlide>
  </CarouselSlides>
</Carousel>
```

```tsx
// A wider gap on larger screens.
<Carousel
  aria-label="Products"
  className="[--carousel-gap:--spacing(2)] md:[--carousel-gap:--spacing(4)]"
>
  ...
</Carousel>
```
