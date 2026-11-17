---
title: "Scatter Chart"
description: "Show the relationship between two measures, optionally grouped by color."
---

## Usage

Pass one row per point and name the numeric fields with `x` and `y`. `group` colors points by a category, and the legend hides and shows each group.

```tsx
import { ScatterChart } from "@erbium/ui/charts/scatter-chart";

<ScatterChart
  ariaLabel="Price against rating"
  data={products}
  x="price"
  y="rating"
  group="category"
/>;
```

Name both axes with `xLabel` and `yLabel`. `format` formats y values and `xFormat` formats x values.
