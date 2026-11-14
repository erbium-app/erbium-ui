---
title: "Autoplay"
description: "Fill the current dot over time, then move on."
---

`autoplay` fills the current pill over `duration` and then selects the next step, so readers can see how long is left before the content changes. It restarts whenever the value changes, whoever changed it. `paused` holds the fill where it is; tie it to a pause button, or to hover over the content it advances. `loop` (on by default) returns to the first step after the last. Reduced motion turns the timer off and shows a solid pill.

```tsx
const [index, setIndex] = useState(0);
const [paused, setPaused] = useState(false);

<StepIndicator
  variant="dots"
  count={4}
  value={index}
  onValueChange={setIndex}
  autoplay={{ duration: 3000, paused }}
/>;
```

The clock moves the fill every frame without re-rendering. When something else owns the clock, pass a motion value to `progress` instead; `CarouselIndicator` does this with the carousel's autoplay timer.
