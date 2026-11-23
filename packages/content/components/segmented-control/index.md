---
title: "Segmented Control"
description: "Choose between a few related options shown side by side."
---

Segments sit in a recessed track, and a raised indicator slides to the active one. The control only draws the segments. The element passed to `render` supplies the behavior, so pick it by what the choice does. The indicator comes from the [unstyled Segmented Control](/docs/react/segmented-control) in `@erbium-ui/react`.

**Import:** `@erbium/ui/components/segmented-control`

## Usage

```tsx
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { SegmentedControl, SegmentedControlItem } from "@erbium/ui/components/segmented-control";
```

```tsx
<SegmentedControl aria-label="Billing period" render={<RadioGroup defaultValue="monthly" />}>
  <SegmentedControlItem render={<Radio.Root value="monthly" />}>Monthly</SegmentedControlItem>
  <SegmentedControlItem render={<Radio.Root value="yearly" />}>Yearly</SegmentedControlItem>
</SegmentedControl>
```

Put behavior props such as `value`, `defaultValue`, `onValueChange`, `name` and `href` on the rendered element. Keep labelling props such as `aria-label` on `SegmentedControl`. Render Base UI's unstyled parts, not the styled `RadioGroupItem` or `ToggleGroupItem`, so no second indicator appears.

## Choose the behavior

| What the choice does                    | Render                                                 |
| --------------------------------------- | ------------------------------------------------------ |
| Picks one value, such as in a form      | Base UI `RadioGroup` with `Radio.Root` items           |
| Applies a filter or mode that can clear | Base UI `ToggleGroup` with `Toggle` items              |
| Moves to another route                  | `<nav>` with links, `aria-current="page"` on one       |
| Shows one of several panels             | [Tabs](/docs/components/tabs), not a segmented control |

Tabs share this component's track, segments and indicator, so both look the same.

## Composition

```text
SegmentedControl
├── SegmentedControlItem
├── SegmentedControlItem
└── (indicator, rendered by SegmentedControl)
```

## Customizing

`SegmentedControl` has one size. Adjust it with `className`: a control that fills a containing row, such as `Control.Segmented`, passes `min-h-0 self-stretch p-0.5` to the track, `min-h-0 rounded-sm px-2` to each segment, and `*:data-[slot=segmented-control-indicator]:rounded-sm` for the indicator.

Before the indicator measures, as in a server render, the active segment draws the raised pill itself.
