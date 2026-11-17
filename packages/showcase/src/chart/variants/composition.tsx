import { barY, defineChart, ruleY } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import {
  Chart,
  ChartLegend,
  chartTheme,
  chartTooltip,
  resolveChartSeries,
} from "@erbium/ui/charts/chart";

const revenue = [
  { month: "Jan", revenue: 186 },
  { month: "Feb", revenue: 305 },
  { month: "Mar", revenue: 237 },
  { month: "Apr", revenue: 173 },
  { month: "May", revenue: 209 },
  { month: "Jun", revenue: 264 },
];

const target = 240;

const series = resolveChartSeries([
  { key: "revenue", label: "Revenue" },
  { color: "var(--muted-foreground)", key: "target", label: "Target" },
]);

const definition = defineChart({
  focus: "group-x",
  marks: [
    barY(revenue, { fill: "var(--chart-1)", inset: 1, radius: 4, x: "month", y: "revenue" }),
    ruleY([target], { stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }),
  ],
  scales: {
    x: { scale: scaleBand },
    y: { grid: true, nice: true, scale: scaleLinear },
  },
  theme: chartTheme,
  tooltip: {
    ...chartTooltip,
    // Without items, the rows are named after the channels, "x" and "y".
    items: [
      { channel: "x", label: "Month" },
      { channel: "y", label: "Revenue" },
      { id: "target", label: "Target", text: () => String(target) },
    ],
  },
});

export default function ChartCompositionExample() {
  return (
    <div className="flex w-2xl max-w-full flex-col gap-3 p-4">
      <ChartLegend series={series} />
      <Chart
        ariaLabel="Monthly revenue against a target of 240"
        definition={definition}
        height={240}
        initialWidth={640}
      />
    </div>
  );
}
