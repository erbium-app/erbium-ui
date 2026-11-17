---
title: "Slider"
description: "Adjust a value within a range."
---

Adjust a value within a range.

**Import:** `@erbium/ui/components/slider`

## Usage

```tsx
import { Slider } from "@erbium/ui/components/slider";
```

```tsx
<Slider defaultValue={[33]} max={100} step={1} />
```

## Choosing a slider

| Need                                                  | Use                                           |
| ----------------------------------------------------- | --------------------------------------------- |
| One value or a range on an even grid                  | `min`, `max`, `step`                          |
| Two or more thumbs                                    | An array value; see Range and Thumb Collision |
| Ticks or labelled positions                           | `marks`                                       |
| A fixed set of values with uneven gaps (0.5×, 1×, 4×) | `steps`                                       |
| A range across orders of magnitude (20 Hz–20 kHz)     | `scale="log"`                                 |
| A compact numeric row in a settings panel or sidebar  | `Control.Number` from the Control component   |

`Slider` and `Control.Number` share the same scale code (`@erbium/ui/lib/slider-scale`), so `steps` and `scale="log"` behave the same in both: the same positions, the same snapping and the same keys.

## Props

`Slider` takes every [Base UI Slider Root](https://base-ui.com/react/components/slider) prop and adds three:

| Prop    | Type                                                | Description                                                                                                    |
| ------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `marks` | `boolean \| { value: number; label?: ReactNode }[]` | Ticks along the track. `true` derives them from `steps`, a short `step` grid, or powers of ten on a log scale. |
| `steps` | `number[]`                                          | Allowed values, including uneven intervals. Replaces `min`, `max` and `step`.                                  |
| `scale` | `"linear" \| "log" \| { toPosition, toValue }`      | How values spread along the track. A custom scale maps a value to a 0–1 track fraction and back.               |

## Value shape and gestures

A numeric value renders one thumb. A one-element array also renders one thumb and keeps its array value shape; a range array renders one thumb per value. Keep the value shape consistent between initial state and updates. Use `onValueChange` for a live preview and `onValueCommitted` for work that should run after the interaction completes.

Keyboard: arrow keys move one step, Shift+arrow and Page Up/Down move ten, and Home and End jump to either end, or to the neighbouring thumb on a range. In right-to-left layouts the horizontal arrows follow reading direction.

Inside a drawer, put `data-base-ui-swipe-ignore="x"` on a horizontal slider or `"y"` on a vertical slider. This lets the control own its touch axis without disabling every drawer gesture. Touch cancellation and interrupted drags are handled by Base UI; do not add document-level pointer listeners to reproduce them.

## Forms and accessibility

Give each slider a name through a `FieldLabel` inside `Field`, or `aria-label` on the slider. With a `name`, the slider submits one form entry per thumb.

With `steps` or a non-linear `scale`, Base UI runs on track positions and `Slider` converts them back to values. Value callbacks, `name` submission and the thumb's announced value text (formatted with `format` and `locale`) all use the real values. `minStepsBetweenValues` counts steps on the linear grid, and `largeStep` is a value distance, so both apply only to sliders without `steps` or a non-linear scale. Those move ten allowed values, or 10% of the track, per large key press.

## Custom scales

A custom scale is any `{ toPosition(value, min, max), toValue(position, min, max) }` pair where `position` runs from 0 at the start of the track to 1 at the end. For example, a square-root scale gives more room to small values:

```tsx
const sqrtScale = {
  toPosition: (value: number, min: number, max: number) => Math.sqrt((value - min) / (max - min)),
  toValue: (position: number, min: number, max: number) => min + position ** 2 * (max - min),
};

<Slider scale={sqrtScale} min={0} max={1000} step={1} />;
```
