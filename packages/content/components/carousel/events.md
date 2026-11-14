---
title: "Events"
story: Events
---

`onValueChange` receives the new position and a `source` that says what moved the carousel: `button`, `drag`, `focus`, `indicator`, `keyboard`, `autoplay`, or `imperative`. Use it for analytics, or to react only to the person's own navigation.

```tsx
<Carousel
  aria-label="Numbers"
  onValueChange={(value, { source }) => {
    console.log(`Slide ${value + 1} via ${source}`);
  }}
>
  <CarouselSlides>...</CarouselSlides>
</Carousel>
```
