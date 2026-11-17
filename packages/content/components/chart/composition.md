---
title: "Composition"
story: Composition
---

A custom definition rendered with `Chart`: monthly revenue bars with a dashed target line. `chartTheme` and `chartTooltip` give it the same colors and tooltip as the chart types, and `ChartLegend` explains both marks.

```tsx
import {
  Chart,
  ChartLegend,
  chartTheme,
  chartTooltip,
  resolveChartSeries,
} from "@erbium/ui/charts/chart";
import { barY, defineChart, ruleY } from "@tanstack/charts";

const definition = defineChart({
  marks: [barY(revenue, { x: "month", y: "revenue", fill: "var(--chart-1)" }), ruleY([target])],
  scales,
  theme: chartTheme,
  tooltip: chartTooltip,
});
```
