---
title: "Heatmap"
description: "Show intensity across two categories, such as activity by weekday and hour."
---

## Usage

Pass one row per cell, and name the column, row, and value fields with `x`, `y`, and `value`.

```tsx
import { HeatmapChart } from "@erbium/ui/charts/heatmap-chart";

<HeatmapChart
  ariaLabel="Orders by weekday and hour"
  data={orders}
  x="hour"
  y="day"
  value="orders"
/>;
```

Cells are one color at five strengths, mixed into the page background rather than interpolated, so they follow light and dark themes. `color` changes the base color; `columns` and `rows` fix the order of each axis. With only a few values, use a table or a [Bar Chart](/docs/charts/bar-chart).
