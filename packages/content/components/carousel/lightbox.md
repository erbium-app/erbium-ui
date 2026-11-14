---
title: "With lightbox"
story: Lightbox
---

`Carousel` and `Lightbox` share the same `value` and `onValueChange` contract, so one state can drive both. Wrap each slide's image in a `LightboxTrigger`. Selecting a slide opens the viewer at that photo, and closing it leaves the carousel on the photo last shown.

```tsx
const [value, setValue] = React.useState(0);

<Lightbox value={value} onValueChange={setValue}>
  <Carousel aria-label="Photos" value={value} onValueChange={setValue}>
    <CarouselSlides>
      <CarouselSlide>
        <LightboxTrigger index={0}>...</LightboxTrigger>
      </CarouselSlide>
    </CarouselSlides>
  </Carousel>
  <LightboxContent aria-label="Photos">...</LightboxContent>
</Lightbox>;
```
