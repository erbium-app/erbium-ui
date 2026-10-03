---
title: "Plugins"
story: Plugin
---

You can use the `plugins` prop to add plugins to the carousel.

```ts
import Autoplay from "embla-carousel-autoplay"

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  )
}
```
