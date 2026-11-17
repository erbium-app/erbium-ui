---
title: "Bar Chart"
description: "Compare values across categories, grouped, stacked, or horizontal."
---

## Usage

Pass one row per category and list the numeric fields to draw in `series`. Each series takes the next chart color unless it sets `color`.

```tsx
import { BarChart } from "@erbium/ui/charts/bar-chart";

<BarChart
  ariaLabel="Visitors by month and device"
  data={visitors}
  index="month"
  series={[
    { key: "desktop", label: "Desktop" },
    { key: "mobile", label: "Mobile" },
  ]}
/>;
```

Use `stacked` to show totals and their parts, and `orientation="horizontal"` for long category names. When many categories have long names on a narrow screen, prefer horizontal bars. For parts of a whole, use a [Pie Chart](/docs/charts/pie-chart).
