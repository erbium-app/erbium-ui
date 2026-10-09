---
title: "Legend"
story: ExampleLegend
---

TanStack Charts renders the legend from the chart definition. The example maps Desktop and Mobile to fixed colors and enables a legend labeled Device.

```tsx
import { chartTextRole } from "@erbium/ui/lib/typography";

import { colorLegend, colorLegendItems } from "@tanstack/charts/legend";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";

const definition = defineChart({
  marks,
  scales,
  color: {
    scale: scaleOrdinal(["Desktop", "Mobile"], ["var(--chart-1)", "var(--chart-2)"]),
    legend: colorLegend({
      label: "Device",
      items: colorLegendItems({
        justify: "start",
        gap: 16,
        rowGap: 8,
        indicator: { shape: "dot", width: 8, height: 8, gap: 7 },
        label: { ...chartTextRole("metadata"), fill: "var(--muted-foreground)" },
      }),
    }),
  },
});
```
