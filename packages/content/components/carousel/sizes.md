---
title: "Sizes"
story: Sizes
---

Set the size of the slides with a `basis` utility on `CarouselSlide`. Use `align="start"` so the first slide sits at the edge.

```tsx
// 33% of the carousel width.
<Carousel aria-label="Products" align="start">
  <CarouselSlides>
    <CarouselSlide className="basis-1/3">...</CarouselSlide>
    <CarouselSlide className="basis-1/3">...</CarouselSlide>
    <CarouselSlide className="basis-1/3">...</CarouselSlide>
  </CarouselSlides>
</Carousel>
```

```tsx
// 50% on medium screens and 33% on larger screens.
<Carousel aria-label="Products" align="start">
  <CarouselSlides>
    <CarouselSlide className="md:basis-1/2 lg:basis-1/3">...</CarouselSlide>
    <CarouselSlide className="md:basis-1/2 lg:basis-1/3">...</CarouselSlide>
    <CarouselSlide className="md:basis-1/2 lg:basis-1/3">...</CarouselSlide>
  </CarouselSlides>
</Carousel>
```
