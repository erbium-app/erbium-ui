---
title: "Slider"
description: "Headless slider with uneven steps, non-linear scales, and marks, on Base UI's slider."
---

A slider built on [Base UI's Slider](https://base-ui.com/react/components/slider). It adds three things on top: allowed values with uneven gaps, scales such as logarithmic, and tick marks with optional labels. Dragging, keyboard input, thumb collision, and form fields all come from Base UI.

Use [styled Slider](/docs/components/slider) for Erbium's track, thumbs, and mark labels.

**Import:** `@erbium-ui/react/slider`

## Anatomy

```tsx
import { Slider } from "@erbium-ui/react/slider";

<Slider.Root defaultValue={25} marks>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
    </Slider.Track>
    <Slider.Marks>{(mark) => <Slider.Mark mark={mark} />}</Slider.Marks>
    <Slider.Thumbs aria-label="Volume" />
  </Slider.Control>
</Slider.Root>;
```

`Control`, `Track`, `Indicator`, and `Label` are Base UI's parts. `Thumbs` renders one thumb per value, so the same markup works for a single value and for a range.

## Steps and scales

`steps` lists the allowed values, and the gaps between them can be uneven. It replaces `min`, `max`, and `step`. Thumbs snap to the nearest allowed value, and each arrow key press moves one allowed value.

```tsx
<Slider.Root steps={[0.5, 1, 1.5, 2, 4]} defaultValue={1} />
```

`scale` sets how values spread along the track:

- `"linear"` is the default.
- `"log"` fits ranges that span orders of magnitude. It needs `min > 0`.
- A custom scale is a `{ toPosition(value, min, max), toValue(position, min, max) }` pair, where position runs from 0 at the start of the track to 1 at the end.

```tsx
<Slider.Root scale="log" min={20} max={20000} defaultValue={440} />
```

With `steps` or a non-linear scale, Base UI runs on track positions, and the root converts them back to values. The real values are what the following see:

- `onValueChange` and `onValueCommitted`;
- the hidden inputs submitted under `name`;
- the text each thumb announces, which is formatted with `format` and `locale`.

Arrow keys move one step, and Shift+arrow and Page Up/Down move ten steps, or 10% of the track. `largeStep` and `minStepsBetweenValues` apply only to linear sliders without `steps`.

## Marks

`marks` places ticks on the track:

- `true` derives them from `steps`, from a `step` grid of ten or fewer intervals, or from each power of ten on a log scale.
- An array of `{ value, label? }` places them yourself. Marks outside the range are dropped.

`Slider.Marks` hands out each mark in track order with a stable key. `Mark` renders the tick, and `MarkLabel` renders its label:

```tsx
<Slider.Marks>
  {(mark) => (
    <>
      <Slider.Mark mark={mark} className="mark" />
      {mark.label === undefined ? null : <Slider.MarkLabel mark={mark} className="label" />}
    </>
  )}
</Slider.Marks>
```

Both parts set `--slider-mark-position`, a number from 0 to 1, so CSS can place them along the track. They also set `data-in-range` on marks between the thumbs of a range, or before the thumb of a single value. Both are hidden from assistive technology, since the thumbs announce the value. `useSlider()` reads the root's `values`, `marks`, `axis`, and `orientation` for layouts that need them, such as sizing a row to its largest label.

## Core

`@erbium-ui/react/slider/core` holds the value math without React, so other track-based controls can share it:

| Function                                  | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `getSliderAxis`                           | Resolves the range, steps, and scale.       |
| `getSliderMarks`                          | Places marks on the track.                  |
| `toTrackPosition` and `fromTrackPosition` | Convert between values and track positions. |
| `snapValue`                               | Snaps a value to an allowed value.          |
| `moveAlongScale`                          | Gives the value a key press reaches.        |

`linearScale`, `logScale`, and `resolveScale` are the scales.

## API reference

### Root

Takes every [Base UI Slider Root](https://base-ui.com/react/components/slider#root) prop, and adds:

| Prop    | Type                                                | Description                                                           |
| ------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `steps` | `number[]`                                          | Allowed values, including uneven gaps. Replaces `min`, `max`, `step`. |
| `scale` | `"linear" \| "log" \| { toPosition, toValue }`      | How values spread along the track.                                    |
| `marks` | `boolean \| { value: number; label?: ReactNode }[]` | Ticks handed out by `Marks`.                                          |

### Parts

| Part        | Element  | Notes                                                                       |
| ----------- | -------- | --------------------------------------------------------------------------- |
| `Thumb`     | Base UI  | On a remapped slider, `getAriaValueText` receives the formatted real value. |
| `Thumbs`    | none     | One `Thumb` per value. Takes the props of every thumb.                      |
| `Marks`     | none     | `children(mark)` for each mark: `{ value, label, position, inRange }`.      |
| `Mark`      | `<span>` | `mark` prop. `--slider-mark-position`, `data-in-range`, `aria-hidden`.      |
| `MarkLabel` | `<span>` | Like `Mark`, with the mark's `label` as its text.                           |
