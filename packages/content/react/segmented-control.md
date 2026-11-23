---
title: "Segmented Control"
description: "Headless sliding indicator for segmented radio groups, toggle groups and links."
---

The indicator of a segmented control. The segments come from Base UI: a [Radio Group](https://base-ui.com/react/components/radio) for a value, a [Toggle Group](https://base-ui.com/react/components/toggle-group) for a filter that can be cleared, or links for navigation. `SegmentedControl.Indicator` follows whichever segment is active.

Base UI's `Tabs.Indicator` does the same for tabs, but it reads the Tabs contexts, so it cannot follow other controls. Use Base UI Tabs directly when each segment shows a panel.

Use [styled Segmented Control](/docs/components/segmented-control) for Erbium's track, segments and indicator.

**Import:** `@erbium-ui/react/segmented-control`

## Anatomy

```tsx
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { SegmentedControl } from "@erbium-ui/react/segmented-control";

<RadioGroup aria-label="Billing period" defaultValue="monthly" className="track">
  <Radio.Root value="monthly">Monthly</Radio.Root>
  <Radio.Root value="yearly">Yearly</Radio.Root>
  <SegmentedControl.Indicator className="indicator" />
</RadioGroup>;
```

```css
.track {
  position: relative;
}

.indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--active-segment-width);
  height: var(--active-segment-height);
  translate: var(--active-segment-left) var(--active-segment-top);
  transition-property: translate, width, height;
  transition-duration: 180ms;
}
```

Place the indicator as the last child of a positioned control. The control's direct children are the segments.

## API

### Indicator

Renders a `<span>` that is hidden from assistive technology. It takes `render` and `className` like other parts.

It follows the first direct child of its parent that is active:

- `data-checked`: a checked Base UI `Radio.Root`;
- `data-pressed`: a pressed Base UI `Toggle`;
- `aria-current="page"`: the current link.

It measures again when one of those attributes changes, when segments are added or removed, and when the control or a segment resizes.

| CSS variable              | Value                                           |
| ------------------------- | ----------------------------------------------- |
| `--active-segment-left`   | Offset from the control's padding box, in `px`. |
| `--active-segment-top`    | Offset from the control's padding box, in `px`. |
| `--active-segment-width`  | The segment's width, in `px`.                   |
| `--active-segment-height` | The segment's height, in `px`.                  |

The offsets are measured inside the control, so the indicator never moves when the control itself moves on the page. Transforms on the control are undone the same way Base UI's tab indicator undoes them.

| Attribute     | Present when                                                           |
| ------------- | ---------------------------------------------------------------------- |
| `data-active` | A segment is active and measured.                                      |
| `hidden`      | No segment is active, or it has not been measured yet, as on a server. |

## Core

`@erbium-ui/react/segmented-control/core` holds the measuring math without React: `getSegmentOffset`, `getCssSize`, `isSameSegmentRect`, and the `ACTIVE_SEGMENT_SELECTOR` and `ACTIVE_SEGMENT_ATTRIBUTES` the indicator watches.
