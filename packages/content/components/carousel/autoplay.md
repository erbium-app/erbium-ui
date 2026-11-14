---
title: "Autoplay"
story: Autoplay
---

Add `CarouselAutoplay` to advance the slides on a timer. It renders the pause and play button that moving content needs, waits while the carousel is hovered or focused, and stops when someone navigates. Under reduced motion it starts paused. Combine it with `loop` so the carousel keeps going past the last slide.

```tsx
<Carousel aria-label="Highlights" loop>
  <CarouselSlides>...</CarouselSlides>
  <CarouselAutoplay delay={2000} />
</Carousel>
```
