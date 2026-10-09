import { barY, defineChart, group } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend";
import { Chart } from "@erbium/ui/components/chart";
import { chartTextRole } from "@erbium/ui/lib/typography";

const monthlyVisitors = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const visitors = monthlyVisitors.flatMap(({ month, desktop, mobile }) => [
  { month, device: "Desktop", visitors: desktop },
  { month, device: "Mobile", visitors: mobile },
]);

export function visitorChart(
  options: { grid?: boolean; axis?: boolean; tooltip?: boolean; legend?: boolean } = {},
) {
  return defineChart({
    theme: {
      foreground: "var(--foreground)",
      muted: "var(--muted-foreground)",
      grid: "var(--border)",
    },
    marks: [
      barY(visitors, {
        x: "month",
        y: "visitors",
        z: "device",
        color: "device",
        layout: group({ padding: 0.12 }),
        radius: 4,
        inset: 1,
      }),
    ],
    scales: {
      x: {
        scale: scaleBand,
        axis: options.axis ? { ticks: { format: (value: string) => value.slice(0, 3) } } : false,
      },
      y: { scale: scaleLinear, nice: true, grid: options.grid },
    },
    color: {
      scale: scaleOrdinal(["Desktop", "Mobile"], ["var(--chart-1)", "var(--chart-2)"]),
      ...(options.legend
        ? {
            legend: colorLegend({
              label: "Device",
              items: colorLegendItems<"Desktop" | "Mobile">({
                justify: "start",
                gap: 16,
                rowGap: 8,
                indicator: { shape: "dot", width: 8, height: 8, gap: 7 },
                label: { ...chartTextRole("metadata"), fill: "var(--muted-foreground)" },
              }),
            }),
          }
        : {}),
    },
    ...(options.tooltip
      ? {
          focus: "group-x" as const,
          tooltip: { use: tooltip, className: "erbium-chart-tooltip" },
        }
      : {}),
  });
}

export function ChartExample() {
  return (
    <Chart
      definition={visitorChart()}
      height={240}
      initialWidth={640}
      ariaLabel="Desktop and mobile visitors by month"
    />
  );
}
