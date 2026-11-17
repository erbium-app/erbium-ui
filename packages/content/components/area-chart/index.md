---
title: "Area Chart"
description: "Show a trend over a range where volume matters, with a fill under each line."
---

## Usage

Area charts take the same props as the [Line Chart](/docs/charts/line-chart), plus `stacked` and `fill`. The default `gradient` fill fades each series toward the baseline in its own color.

```tsx
import { AreaChart } from "@erbium/ui/charts/area-chart";

<AreaChart ariaLabel="Visitors by month" data={visitors} index="month" series={devices} stacked />;
```

Unstacked areas overlap, so keep them to two or three series. When exact values matter more than shape, use a line chart or a table.
