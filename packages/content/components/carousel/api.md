---
title: "Controlled"
story: Api
---

Pass `value` and `onValueChange` to control the position from your own state. Any control can then move the carousel, and the carousel reports swipes and key presses back through `onValueChange`. `CarouselIndicator` and `CarouselCounter` follow the position without extra wiring.

```tsx
const [value, setValue] = React.useState(0);

<Carousel aria-label="Workflow" value={value} onValueChange={setValue}>
  <CarouselSlides>...</CarouselSlides>
  <CarouselIndicator />
  <CarouselCounter />
</Carousel>;
```

To build a control inside the carousel, read `useCarousel()`:

```tsx
const JumpToEnd = () => {
  const { state, actions } = useCarousel();

  return <Button onClick={() => actions.goTo(state.count - 1)}>Last</Button>;
};
```
