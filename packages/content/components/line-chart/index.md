---
title: "Line Chart"
description: "Show change over a range, for one series or several that overlap."
---

## Usage

Pass one row per x value. `index` names the x field and `indexType` says how to read it: `category` (the default), `number`, or `time` for UTC dates.

```tsx
import { LineChart } from "@erbium/ui/charts/line-chart";

<LineChart ariaLabel="Visitors by month" data={visitors} index="month" series={devices} />;
```

`curve` is `smooth` by default; use `linear` when each value is a discrete reading and `step` for values that hold until they change. For parts of a whole over time, use a stacked [Area Chart](/docs/charts/area-chart).
