---
title: "With lightbox"
story: Lightbox
---

`Carousel` selects by index and `Lightbox` by `itemId`, and `Lightbox`'s `onValueChange` also reports the index, so one state can drive both. Wrap each slide's image in a `LightboxTrigger`. Selecting a slide opens the viewer at that photo, and closing it leaves the carousel on the photo last shown. While the viewer covers the carousel, a new `value` moves the carousel without animation, so it is already at rest when the close transition measures where to land.

```tsx
const [value, setValue] = React.useState(0);

<Lightbox value={photos[value]?.id} onValueChange={(_, { index }) => setValue(index)}>
  <Carousel aria-label="Photos" value={value} onValueChange={setValue}>
    <CarouselSlides>
      <CarouselSlide>
        <LightboxTrigger itemId={photos[0].id}>...</LightboxTrigger>
      </CarouselSlide>
    </CarouselSlides>
  </Carousel>
  <LightboxContent aria-label="Photos">...</LightboxContent>
</Lightbox>;
```
