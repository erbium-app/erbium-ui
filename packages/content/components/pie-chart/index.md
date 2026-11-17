---
title: "Pie Chart"
description: "Show the parts of a whole as a pie or donut, with optional content in the middle."
---

## Usage

Pass one row per slice. `index` names each slice and `value` sizes it. Slices take the chart colors in data order; pass `series` to set labels or colors by slice name.

```tsx
import { PieChart } from "@erbium/ui/charts/pie-chart";

<PieChart ariaLabel="Visitors by browser" data={browsers} index="browser" value="visitors" />;
```

Keep a pie to five slices and group the rest into "Other". When slices are close in size, compare them in a [Bar Chart](/docs/charts/bar-chart) instead.
