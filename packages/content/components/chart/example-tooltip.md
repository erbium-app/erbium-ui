---
title: "Tooltip"
story: ExampleTooltip
---

Hover or focus a bar to inspect its value. The chart definition enables grouped focus and TanStack Charts' tooltip extension. The shared month appears as the heading, with a value and color swatch for each device.

```tsx
import { tooltip } from "@tanstack/charts/tooltip";

const definition = defineChart({
  marks,
  scales,
  focus: "group-x",
  tooltip: { use: tooltip, className: "erbium-chart-tooltip" },
});
```

Configure tooltip content with `items`, `format`, or `formatGroup` in the definition. See the [TanStack Charts tooltip guide](https://tanstack.com/charts/latest/docs/framework/react/guides/tooltips-and-focus) for placement and formatting options.
