---
title: "Carousel"
description: "Browse a sequence of slides."
---

## Usage

The carousel supports swipe, keyboard, and button navigation, several slides per view, both orientations, looping, and autoplay. Embla Carousel runs the scrolling underneath, but none of its API is part of the component: consumers work only with the props and parts below.

**Import:** `@erbium/ui/components/carousel`

```tsx
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
} from "@erbium/ui/components/carousel";
```

```tsx
<Carousel aria-label="Featured products">
  <CarouselSlides>
    <CarouselSlide>...</CarouselSlide>
    <CarouselSlide>...</CarouselSlide>
    <CarouselSlide>...</CarouselSlide>
  </CarouselSlides>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## Composition

Use the following composition to build a `Carousel`:

```text
Carousel
├── CarouselSlides
│   ├── CarouselSlide
│   └── CarouselSlide
├── CarouselPrevious
├── CarouselNext
├── CarouselIndicator
├── CarouselCounter
└── CarouselAutoplay
```

Only `CarouselSlides` and its slides are required. The controls read the carousel's state from context, so place them anywhere inside `Carousel`.

## Props

`Carousel` takes the selected position and the scrolling behavior. It renders a `section`, so it also accepts that element's props.

| Prop             | Type                           | Default        | Description                                                          |
| ---------------- | ------------------------------ | -------------- | -------------------------------------------------------------------- |
| `value`          | `number`                       |                | Zero-based selected position. Controlled.                            |
| `defaultValue`   | `number`                       | `0`            | Initial position when uncontrolled.                                  |
| `onValueChange`  | `(value, { source }) => void`  |                | Called when the position changes, with what caused it.               |
| `orientation`    | `"horizontal" \| "vertical"`   | `"horizontal"` | Scroll axis. Vertical carousels need a height on `CarouselSlides`.   |
| `align`          | `"start" \| "center" \| "end"` | `"start"`      | Where slides rest inside the viewport.                               |
| `loop`           | `boolean`                      | `false`        | Wraps from the last slide to the first and back.                     |
| `dragFree`       | `boolean`                      | `false`        | Lets a swipe glide freely instead of settling on a slide.            |
| `slidesToScroll` | `number \| "auto"`             | `1`            | Slides moved per step. `auto` moves by however many fit in the view. |
| `dir`            | `"ltr" \| "rtl"`               | inherited      | Reading direction. Arrow keys and swipes follow it.                  |

`source` is one of `button`, `drag`, `focus`, `indicator`, `keyboard`, `autoplay`, or `imperative`.

When several slides share the view, a position can hold more than one slide. `value`, `CarouselIndicator`, and `CarouselCounter` count positions, not slides.

## Styling

- Size slides with `basis-*` utilities on `CarouselSlide`. The default fills the viewport.
- Set the space between slides with the `--carousel-gap` custom property on `Carousel`. The default is `--spacing(4)`.
- Put a `Card` or another `surface-panel` element straight inside each slide. The viewport leaves room past its edges for surface rims and shadows, so slides need no extra padding to keep them visible.
- Slides in view carry `data-in-view`. The root carries `data-orientation` and, while autoplay runs, `data-playing`.

## Custom controls

`useCarousel()` returns `{ state, actions }` inside a `Carousel`. `state` holds `value`, `count`, `canPrevious`, `canNext`, `orientation`, and `playing`. `actions` holds `goTo(index)`, `previous()`, and `next()`.

## Accessibility

Give `Carousel` an `aria-label` that names its content; the component already announces itself as a carousel. Each slide is a group labelled with its position, such as "2 of 5", unless you pass your own `aria-label`. Arrow keys move between positions while focus is inside the carousel, and Home and End jump to the first and last. The slides are a polite live region except while autoplay runs. Autoplay waits while the carousel is hovered or focused, stops when someone navigates, and starts paused when the system asks for reduced motion. While it plays, the current indicator dot fills with the time left on the slide.
